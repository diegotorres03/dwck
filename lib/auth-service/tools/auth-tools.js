/* eslint-disable */
// import {} from 'aws-amplify/auth'

import * as AmplifyLib from './amplify-lib.js'

const Amplify = AmplifyLib.Amplify
const Auth = AmplifyLib.Auth

console.log('AmplifyLib', AmplifyLib.Auth)
let webClientId = null

export function configureAuth(userPoolId, userPoolWebClientId, region) {
  // Configurar Amplify
  Amplify.configure({
    // Amplify.configure({
    Auth: {
      region, //: 'sa-east-1', // ej. 'us-east-1'
      userPoolId, //: 'sa-east-1_CqjNHExsI', // ej. 'us-east-1_XXXXXXXXX'
      userPoolWebClientId // ej. 'XXXXXXXXXXXXXXXXXXXXXXXXXX'
    }
  })

  webClientId = userPoolWebClientId

  console.log(Auth)
}

export async function confirmRegistration(email, confirmationCode) {
  return Auth.confirmSignUp(email, confirmationCode)
}

export async function signUp(data) {
  return ({ user } = await Auth.signUp({
    data
  }))
}

export async function logout() {
  window.localStorage.clear()
  return Auth.signOut()
}

export async function login(email, password) {
  return Auth.signIn(email, password)
}

export function completeNewPassword(user, newPassword) {
  return Auth.completeNewPassword(user, newPassword)
}

export function getCurrentUser() {
  return Auth.currentAuthenticatedUser()
}

export function sendCustomChallengeAnswer(user, challengeVerifier) {
  return Auth.sendCustomChallengeAnswer(user, challengeVerifier)
}

export function getUserToken() {}

export function getIdToken() {
  const tokenKey = `CognitoIdentityServiceProvider.${webClientId}.${getLastUserToken()}.idToken`
  return window.localStorage.getItem(tokenKey)
}

export function getRefreshToken() {
  const tokenKey = `CognitoIdentityServiceProvider.${webClientId}.${getLastUserToken()}.refreshToken`
  return window.localStorage.getItem(tokenKey)
}

export function getAccessToken() {
  const tokenKey = `CognitoIdentityServiceProvider.${webClientId}.${getLastUserToken()}.accessToken`

  // CognitoIdentityServiceProvider.7qm1rdrpgq4tj6thhdp2kp9icd.93dc9afa-c061-70a5-cf48-fbe8295a82de.accessToken
  return window.localStorage.getItem(tokenKey)
}

export function getUserData() {
  const tokenKey = `CognitoIdentityServiceProvider.${webClientId}.${getLastUserToken()}.userData`
  return window.localStorage.getItem(tokenKey)
}

export function getLastUserToken() {
  const tokenKey = `CognitoIdentityServiceProvider.${webClientId}.LastAuthUser`
  return window.localStorage.getItem(tokenKey)
}
