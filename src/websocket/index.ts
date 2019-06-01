import axios, { AxiosResponse } from "axios"
import cookie from "cookie"
import { Logger as Log4js } from "log4js"
import ws from "ws"

export interface Token {
  id: number,
  username: string,
  displayName: string,
  profilePhoto: string,
  vendor: string,
  iat: number,
  exp: number,
  iss: string,
  sub: string
}

export interface Error {
  valid: false,
  status: "Please log in"|"Token has expired"
}

export default class WebSocket {
  public ws: ws.Server
  protected logger: Log4js

  constructor(port: number, logger: Log4js) {
    this.logger = logger
    this.ws = new ws.Server({
      port,
      verifyClient: async (info, done) => {
        const userCookie = cookie.parse(info.req.headers.cookie!)

        if (userCookie.isLogin) {
          const data: AxiosResponse<Token|Error> = await axios({
            method: "get",
            url: process.env.checkURL!,
            headers: {
              Cookie: `${cookie.serialize("isLogin", "true", {
                  httpOnly: false,
                })}; ${cookie.serialize("authorization", userCookie.authorization, {
                  httpOnly: true,
                })};`,
            },
          })

          if (!(data.data as Error).status) {
            done(true, 101, "login success")
            return
          } else if (!(data.data as Error).status) {
            done(false, 400, "is not verifyed user")
            return
          } else {
            done(false, 500, "error")
            return
          }
        } else {
          done(false, 400, "please connect before login")
        }
        done(true)
      },
     })

    this.ws.on("listening", () => {
      this.logger.info(`WS server listen on port ${this.ws.options.port}`)
    })
  }
}
