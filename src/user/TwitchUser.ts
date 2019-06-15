import { Logger } from 'log4js'
import tmi, { Userstate } from 'tmi.js'
import WebSocket from 'ws'
import ChatEvent from '../chatEvent'

export default class TwitchUser {
  private socket: WebSocket
  private tmi: tmi.Client
  private channelName: string
  private chatEvent: typeof ChatEvent
  private logger: Logger
  private twitchConnectedUser: string[]

  constructor(data: {
    socket: WebSocket,
    twitchClient: tmi.Client,
    chatEvent: typeof ChatEvent,
    channelName: string,
    logger: Logger
    twitchConnectedUser: string[]
  }) {
    this.socket = data.socket
    this.tmi = data.twitchClient
    this.channelName = data.channelName
    this.chatEvent = data.chatEvent
    this.logger = data.logger
    this.twitchConnectedUser = data.twitchConnectedUser

    this.tmi.join(`#${this.channelName}`)
    this.logger.info(`TWITCH: CONNECT with ${this.channelName} channel`)
  }

  public run() {
    this.chatEvent.on(`#${this.channelName}`, this.chatEventHandler)

    this.socket.on('close', (code, reason) => {
      this.destroy()
    })
  }

  public destroy(): void {
    this.logger.info(`DISCONNECT with ${this.channelName} channel`)
    this.twitchConnectedUser.slice(this.twitchConnectedUser.indexOf(this.channelName))
    this.tmi.part(`#${this.channelName}`)
    this.chatEvent.removeListener(`#${this.channelName}`, this.chatEventHandler)

    return
  }

  private onChat(context: Userstate, msg: string): void {
    this.logger.debug(`user: ${context.username}, where: ${this.channelName}, msg: ${msg}`)

    this.socket.send(JSON.stringify({
      displayName: context['display-name'],
      username: context.username,
      message: msg,
      emotes: context.emotes,
      userType: context['user-type'],
      badges: context.badges,
    }))
  }

  private chatEventHandler = (context: Userstate, msg: string) => this.onChat(context, msg)
}
