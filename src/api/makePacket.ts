import { Badges } from 'tmi.js'

export function makePacket(info: {
  vendor: string,
  displayName: string,
  message: string,
  emotes: { [key: string]: string[] }|undefined,
  userType: string|undefined,
  badges: { [key: string]: string }|Badges|undefined
}): string {
  const {
    vendor,
    displayName,
    message,
    emotes,
    userType,
    badges,
  } = info

  return JSON.stringify({
    error: false,
    data: {
      vendor,
      displayName,
      message,
      emotes,
      userType,
      badges,
    },
  })
}

export function makeErrorPacket(msg: string): string {
  return JSON.stringify({
    error: true,
    data: msg,
  })
}

export interface ISuccess {
  error: false,
  data: {
    vendor: string,
    displayName: string,
    message: string,
    emotes: { [key: string]: string[] }|undefined,
    userType: string|undefined,
    badges: { [key: string]: string }|Badges|undefined
  }
}

export interface IError {
  error: true,
  data: string
}
