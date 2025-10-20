import React, {FunctionComponent, PropsWithChildren, useContext, useEffect} from 'react'
import {getRedirectURL, MissingAccessTokenError, MissingScopeError, UserInfo, userInfo} from '../svc/oauth2'

const Oauth2Context = React.createContext<{
  userInfo: UserInfo
} | null>(null)

export const useUserInfo = () => {
  const context = useContext(Oauth2Context)
  if (!context) {
    throw new Error('useOauth2 must be used within an Oauth2Provider')
  }
  return context.userInfo
}

const Oauth2: FunctionComponent<PropsWithChildren> = ({children}) => {
  const [contextVal, setContextVal] = React.useState<{
    userInfo: UserInfo
  } | null>(null)

  useEffect(() => {
    ;(async function init() {
      try {
        const userInfoResponse = await userInfo()
        setContextVal({userInfo: await userInfoResponse.json()})
      } catch (error) {
        if (error instanceof MissingAccessTokenError || error instanceof MissingScopeError) {
          // user needs to reauthorize - lets do this
          const redirectUrl = await getRedirectURL()
          // redirect the user
          window.location.replace(redirectUrl)
        }
      }
    })()
  }, [])
  if (!contextVal) {
    // while we are waiting for the user info, we can return null or a loading state
    return (
      <div className="h-screen font-sans flex flex-row items-center justify-center">
        <div className="kern-loader kern-loader--visible" role="status">
          <span className="kern-sr-only">Wird geladen...</span>
        </div>
      </div>
    )
  }
  return <Oauth2Context.Provider value={contextVal}>{children}</Oauth2Context.Provider>
}

export default Oauth2
