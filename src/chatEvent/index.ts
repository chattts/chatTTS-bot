import EventEmitter from "events"
import { Userstate } from "tmi.js"

declare interface ChatEvent {
  on(event: string | symbol, listener: (context: Userstate, msg: string) => void): this
}

class ChatEvent extends EventEmitter {
  public emitEvent(name: string, context: Userstate, msg: string): void {
    this.emit(name, context, msg)
  }
}

export default new ChatEvent()
