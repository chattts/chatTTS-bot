import { EventEmitter } from "events"
import { Logger as Log4js } from "log4js"
import tmi from "tmi.js"

export default class Twitch extends EventEmitter {
  public tmi: tmi.Client
  protected logger: Log4js

  constructor(username: string, password: string, logger: Log4js) {
    super()
    const opts: tmi.Options = {
      identity: {
        username,
        password,
      },
      channels: [
        "#chattts",
      ],
      connection: {
        secure: true,
      },
    }

    this.tmi = tmi.client(opts)
    this.logger = logger
  }

  public async run() {
    return this.tmi.connect()
  }
}
