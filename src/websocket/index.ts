import { Logger as Log4js } from "log4js"
import ws from "ws"

export default class WebSocket {
  public ws: ws.Server
  protected logger: Log4js

  constructor(port: number, logger: Log4js) {
    this.logger = logger
    this.ws = new ws.Server({
      port,
      verifyClient: (info, done) => {
        this.logger.debug(info.req.url)
        done(true)
      },
     })

    this.ws.on("listening", () => {
      this.logger.info(`WS server listen on port ${this.ws.options.port}`)
    })
  }
}
