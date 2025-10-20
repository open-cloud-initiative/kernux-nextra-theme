import * as client from 'openid-client'

export interface UserInfo {
  sub: string
  sub_legacy: string
  name: string
  nickname: string
  preferred_username: string
  email: string
  email_verified: boolean
  profile: string
  picture: string
  groups: string[]
  'https://gitlab.org/claims/groups/owner': string[]
  'https://gitlab.org/claims/groups/maintainer': string[]
  'https://gitlab.org/claims/groups/developer': string[]
}

const config = new client.Configuration(
  {
    issuer: 'https://gitlab.opencode.de',
    authorization_endpoint: 'https://gitlab.opencode.de/oauth/authorize',
    token_endpoint: 'https://gitlab.opencode.de/oauth/token',
    userinfo_endpoint: 'https://gitlab.opencode.de/oauth/userinfo',
    jwks_uri: 'https://gitlab.opencode.de/oauth/jwks',
  },
  '69bba5764fed80740f0e7685ea6cccfb43e6fd0177826280a1556de87068e2cc',
)

export const fetchProtectedResource = async (
  url: URL,
  method: string = 'GET',
  body?: client.FetchBody,
  headers?: Headers,
): Promise<Response> => {
  let accessToken = sessionStorage.getItem('accessToken')
  if (!accessToken) {
    throw new Error('No access token found in session storage')
  }

  const response = await client.fetchProtectedResource(config, accessToken, url, method, body, headers)

  if (response.status === 401) {
    // try to refresh the token
    const refreshToken = sessionStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token found in session storage')
    }
    const tokens = await client.refreshTokenGrant(config, refreshToken)
    accessToken = tokens.access_token
    sessionStorage.setItem('accessToken', tokens.access_token)
    sessionStorage.setItem('refreshToken', tokens.refresh_token || '')
    // retry the request with the new access token
    const response = await client.fetchProtectedResource(config, accessToken, url, method, body, headers)
    if (!response.ok) {
      throw new Error(`Failed to fetch protected resource after token refresh: ${response.statusText}`)
    }
    return response
  }

  return response
}

export class MissingAccessTokenError extends Error {
  constructor() {
    super('No access token found in session storage')
    this.name = 'MissingAccessTokenError'
  }
}

export class MissingScopeError extends Error {
  constructor() {
    super('Token does not have the required scope')
    this.name = 'MissingScopeError'
  }
}

export const userInfo = async () => {
  const accessToken = sessionStorage.getItem('accessToken')
  if (!accessToken) {
    throw new MissingAccessTokenError()
  }
  try {
    const userInfoResponse = await fetchProtectedResource(new URL('https://gitlab.opencode.de/oauth/userinfo'))
    return userInfoResponse
  } catch (err: any) {
    console.error('Error fetching user info:', err)
    throw new MissingScopeError()
  }
}

const handleCallback = async (url: URL) => {
  const state = sessionStorage.getItem('state')
  const codeVerifier = sessionStorage.getItem('codeVerifier')

  if (!state || !codeVerifier) {
    throw new Error('Missing state or codeVerifier in session storage')
  }

  // Check if we already processed this callback
  const accessToken = sessionStorage.getItem('accessToken')
  if (accessToken) {
    console.log('Tokens already exist, skipping callback processing')
    return
  }

  try {
    const tokens = await client.authorizationCodeGrant(config, url, {
      expectedState: state,
      pkceCodeVerifier: codeVerifier,
    })

    sessionStorage.removeItem('state')
    sessionStorage.removeItem('codeVerifier')
    sessionStorage.setItem('accessToken', tokens.access_token)
    sessionStorage.setItem('refreshToken', tokens.refresh_token || '')

    console.log('OAuth2 tokens successfully stored')
  } catch (error) {
    console.error('OAuth2 callback error:', error)
    // Clean up session storage on error
    sessionStorage.removeItem('state')
    sessionStorage.removeItem('codeVerifier')
    throw error
  }
}

const getRedirectURL = async () => {
  const codeVerifier: string = client.randomPKCECodeVerifier()
  const codeChallenge: string = await client.calculatePKCECodeChallenge(codeVerifier)

  const parameters: Record<string, string> = {
    redirect_uri: 'http://localhost:3000/oauth2/callback',
    scope: 'api openid profile email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: client.randomState(),
  }

  // save state and codeVerifier in session storage
  sessionStorage.setItem('state', parameters.state)
  sessionStorage.setItem('codeVerifier', codeVerifier)

  return client.buildAuthorizationUrl(config, parameters)
}

export {handleCallback, getRedirectURL}
