import { Logger } from "log4js"
import tmi from "tmi.js"
import WebSocket from "ws"
import ChatEvent from "../chatEvent"

export default class User {
  private socket: WebSocket
  private tmi: tmi.Client
  private channelName: string
  private chatEvent: typeof ChatEvent
  private logger: Logger

  constructor(
    socket: WebSocket,
    twitchClient: tmi.Client,
    chatEvent: typeof ChatEvent,
    channelName: string,
    logger: Logger
  ) {
    this.socket = socket
    this.tmi = twitchClient
    this.channelName = channelName
    this.chatEvent = chatEvent
    this.logger = logger

    this.tmi.join(`#${channelName}`)
    this.logger.info(`CONNECT with ${this.channelName} channel`)
  }

  public run() {
    this.chatEvent.on(`#${this.channelName}`, (context, msg) => {
      this.logger.debug(`user: ${context.username}, where: ${this.channelName}, msg: ${msg}`)

      this.socket.send(JSON.stringify({
        displayName: context["display-name"],
        username: context.username,
        message: msg,
        emotes: context.emotes,
        userType: context["user-type"],
        badges: context.badges,
      }))
    })

    this.socket.on("close", (code, reason) => {
      this.destroy()
    })
  }

  public destroy(): void {
    this.logger.info(`DISCONNECT with ${this.channelName} channel`)
    this.tmi.part(`#${this.channelName}`)
    this.chatEvent.removeAllListeners(`#${this.channelName}`)

    return
  }
}
