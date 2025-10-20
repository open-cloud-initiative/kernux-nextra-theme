// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

interface Challenge {
  challenge: string
  salt: string
  difficulty: number
}

export const sendFeedback = async (
  feedbackServerUrl: string,
  projectId: string,
  labels: string[],
  feedback: string,
  email?: string,
) => {
  // first request a challenge from the server
  const challengeResponse = await fetch(`${feedbackServerUrl}/challenge`)
  if (!challengeResponse.ok) {
    throw new Error('Failed to get challenge from server')
  }
  const challengeData: Challenge = await challengeResponse.json()

  // lets try to solve it
  const solution = await solveChallenge(challengeData)
  // now we can send the feedback
  const response = await fetch(`${feedbackServerUrl}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    /**
     * 		type RequestDataForm struct {
			Description       string   `json:"description"`
			Email             string   `json:"email"`
			Labels            []string `json:"labels"`
			ProjectID         string   `json:"projectId"`
			PagePath          string   `json:"pagePath"`
			ChallengeHash     string   `json:"challenge"`
			ChallengeSolution string   `json:"challengeSolution"`
		}
     */
    body: JSON.stringify({
      projectId,
      pagePath: window.location.pathname + window.location.search,
      labels,
      description: feedback,
      email,
      challenge: challengeData.challenge,
      challengeSolution: solution.toString(10),
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to send feedback')
  }
  const data: {
    status: 'success'
    issueUrl: string
    issueId: string
  } = await response.json()
  return data
}

// solving a proof-of-work challenge
const solveChallenge = async (challenge: Challenge): Promise<number> => {
  console.time('proof-of-work')
  // iterate over all numbers from 0 to difficulty
  const encoder = new TextEncoder()
  for (let i = 0; i < challenge.difficulty; i++) {
    // check if the hash of the challenge + salt + i is equal to the challenge
    const msg = encoder.encode(`${challenge.salt}:${i}`)
    const buffer = await window.crypto.subtle.digest('SHA-256', msg)
    // convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(buffer)) // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
    if (hashHex === challenge.challenge) {
      return i
    }
  }
  console.timeEnd('proof-of-work')

  throw new Error('Failed to solve challenge')
}
