import cookie from "cookie"
import dotenv from "dotenv"
import log4js from "log4js"

import chatEvent from "./chatEvent"
import Twitch from "./twitch"
import User from "./user"
import WebSocket from "./websocket"

const logger = log4js.getLogger()
dotenv.config()

try {
  if (process.env.dev === "false") {
    logger.level = "INFO"
    process.env.NODE_ENV = "production"
  } else {
    logger.level = "DEBUG"
    process.env.NODE_ENV = "development"
  }

  const wss = new WebSocket(8080, logger)
  const twitch = new Twitch(process.env.username!, process.env.password!, logger)

  const twitchConnectedUser: string[] = [];

  (async () => {
    try {
      wss.ws.on("connection", (socket, request) => {
        logger.info(`WS connected`)

        const userCookie = cookie.parse(request.headers.cookie!)

        if (userCookie.twitch) {
          if (twitchConnectedUser.indexOf(userCookie.twitch) !== -1) {
            socket.close()
          } else {
            twitchConnectedUser.push(userCookie.twitch)
            const twitchUser = new User({
              socket,
              twitchClient: twitch.tmi,
              chatEvent,
              channelName: userCookie.twitch,
              logger,
              twitchConnectedUser,
            })
            twitchUser.run()
          }
        } else {
          socket.send(JSON.stringify({
            error: true,
            message: "must set twitch cookie",
          }))
          socket.close()
        }
      })

      twitch.tmi.on("message", (channel, context, msg, self) => {
        if (self) {
          return
        } else {
          chatEvent.emitEvent(channel, context, msg)
        }
      })

      twitch.run().then(([addr, port]) => {
        logger.info(`Connected to ${addr}:${port}`)
      }).catch((error) => {
        logger.error("not connected with twitch server. close the program!")
        logger.debug(error)

        process.exit(1)
      })

      chatEvent.on("#chattts", (context, msg) => {
        logger.debug(`#chatTTS: ${context.username}: ${msg}`)
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
