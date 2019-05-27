import dotenv from "dotenv"
import log4js from "log4js"
import tmi from "tmi.js"

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

  const opts: tmi.Options = {
    identity: {
      username: process.env.username,
      password: process.env.password,
    },
    channels: [
    ],
    connection: {
      secure: true,
    },
  }

  const client = tmi.client(opts)

  client.on("message", (channel, context, msg, self) => {
    if (self) {
      return
    } else {
      logger.info(`user: ${context["display-name"] || context.username}, where: ${channel}, msg: ${msg}`)
    }
  })

  client.on("connected", (addr, port) => {
    logger.info(`Connected to ${addr}:${port}`)
  })

  client.connect()

} catch (error) {
// tslint:disable-next-line: no-console
  console.error(error)
}
