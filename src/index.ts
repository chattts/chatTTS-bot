import dotenv from "dotenv"
import log4js from "log4js"

import { default as ChatEvent } from "./chatEvent"
import { default as Twitch } from "./twitch"
import { default as WebSocket } from "./websocket"

const logger = log4js.getLogger()
dotenv.config()

try {
  /*if (config.dev === false) {
    logger.level = "INFO"
    process.env.NODE_ENV = "production"
  } else {
    logger.level = "DEBUG"
    process.env.NODE_ENV = "development"
  }*/
  logger.level = "DEBUG"
  process.env.NODE_ENV = "development"

  const wss = new WebSocket(8080, logger)
  const twitch = new Twitch(process.env.username!, process.env.password!, logger)
  const chatEvent = new ChatEvent();

  (async () => {
    try {
      wss.ws.on("connection", (socket, request) => {
        logger.debug(`WS connected`)
        socket.on("message", (data) => {
          logger.debug(`received: ${data}`)
        })
      })

      twitch.tmi.on("message", (channel, context, msg, self) => {
        if (self) {
          return
        } else {
          chatEvent.emitEvent(channel, context, msg)
          logger.info(`user: ${context["display-name"]
            ? `${context.username}(${context["display-name"]})`
            : context.username}, where: ${channel}, msg: ${msg}`)
        }
      })

      twitch.run().then(([addr, port]) => {
        logger.info(`Connected to ${addr}:${port}`)

        twitch.tmi.join("#flower0418")
      }).catch((error) => {
        logger.error("not connected with twitch server. close the program!")
        logger.debug(error)

        process.exit(1)
      })
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
  })()

} catch (error) {
// tslint:disable-next-line: no-console
  console.error(error)
}
