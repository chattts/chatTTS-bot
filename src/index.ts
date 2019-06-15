import dotenv from 'dotenv'
import log4js from 'log4js'
import path from 'path'
import { default as URL } from 'url'

const logger = log4js.getLogger()
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

import chatEvent from './chatEvent'
import Twitch from './twitch'
import { TwitchUser, YoutubeUser } from './user'
import WebSocket from './websocket'

try {
  if (process.env.dev === 'false') {
    logger.level = 'INFO'
    process.env.NODE_ENV = 'production'
  } else {
    logger.level = 'DEBUG'
    process.env.NODE_ENV = 'development'
  }

  const wss = new WebSocket(8080, logger)
  const twitch = new Twitch(
    process.env.twitch_username!,
    process.env.twitch_password!,
    logger
  )

  const twitchConnectedUser: string[] = [];

  (async () => {
    try {
      wss.ws.on('connection', (socket, request) => {
        logger.info(`WS connected`)

        const url = new URL.URL(request.url || '')

        const queryTwitch = url.searchParams.get('twitch')
        const queryYoutube = url.searchParams.get('youtube')

        if (queryTwitch) {
          const twitchUser = new TwitchUser({
            socket,
            twitchClient: twitch.tmi,
            chatEvent,
            channelName: queryTwitch,
            logger,
            twitchConnectedUser,
          })
          twitchUser.run()
        }

        if (queryYoutube) {
          /* const youtubeUser = new YoutubeUser({
            socket,
            liveChatId: queryYoutube,
            logger,
          }) */
        }

        /*
        socket.send(JSON.stringify({
          error: true,
          message: "you must login",
        }))
        socket.close()
        */
      })

      twitch.tmi.on('message', (channel, context, msg, self) => {
        if (self) {
          return
        } else {
          chatEvent.emitEvent(channel, context, msg)
        }
      })

      twitch.run().then(([addr, port]) => {
        logger.info(`Connected to ${addr}:${port}`)
      }).catch((error) => {
        logger.error('not connected with twitch server. close the program!')
        logger.debug(error)

        process.exit(1)
      })

      chatEvent.on('#chattts', (context, msg) => {
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
