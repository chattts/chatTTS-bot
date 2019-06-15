import { Logger } from 'log4js'
import WebSocket from 'ws'
import YoutubeChatAPI, { ILiveChatMessage } from 'youtube-chat-api'
import { GetAccessToken } from '../api'

// tslint:disable-next-line: no-var-requires
/* const Token = require('../../tokens/google.json')

export default class TwitchUser {
  private socket: WebSocket
  private youtube: YoutubeChatAPI
  private liveChatId: string
  private logger: Logger

  constructor(data: {
    socket: WebSocket,
    liveChatId: string,
    logger: Logger
  }) {
    this.socket = data.socket
    this.liveChatId = data.liveChatId
    this.logger = data.logger

    const accessToken = GetAccessToken.get(

    )

    this.youtube = new YoutubeChatAPI(this.liveChatId,
      1000,
      process.env.youtube_key!,
      accessToken
    )
    this.logger.info(`YOUTUBE: CONNECT with ${this.liveChatId} channel`)
  }

  public run() {
    this.youtube.on('message', this.chatEventHandler)

    this.socket.on('close', (code, reason) => {
      this.destroy()
    })
    this.youtube.on('stop', () => {
      this.destroy()
    })
  }

  public destroy(): void {
    this.logger.info(`YOUTUBE: DISCONNECT with ${this.liveChatId} channel`)
    this.youtube.stop()

    return
  }

  private onChat(value: ILiveChatMessage): void {
    if (value.snippet.type === 'textMessageEvent') {
      this.logger.debug(`user: ${value.authorDetails.displayName}, where: ${this.liveChatId},` +
        `msg: ${value.snippet.textMessageDetails.messageText}`)

      this.socket.send(JSON.stringify({
        displayName: value.authorDetails.displayName,
        username: value.authorDetails.displayName,
        message: value.snippet.textMessageDetails.messageText,
        emotes: null,
        userType: null,
        badges: null,
      }))
    }
  }

  private chatEventHandler = (value: ILiveChatMessage) => this.onChat(value)
} */
