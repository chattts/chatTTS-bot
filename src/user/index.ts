import { Logger } from "log4js"
import tmi, { Userstate } from "tmi.js"
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
  }

  public run() {
    this.chatEvent.on(`#${this.channelName}`, (context, msg) => {
      const username = this.getUsername(context)
      this.logger.debug(`user: ${username}, where: ${this.channelName}, msg: ${msg}`)

      this.socket.send(JSON.stringify({
        displayName: username,
        username: context.username,
        message: msg,
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

  private getUsername(context: Userstate): string {
    return context["display-name"]
      ? `${context.username} (${context["display-name"]})`
      : context.username
  }
}
