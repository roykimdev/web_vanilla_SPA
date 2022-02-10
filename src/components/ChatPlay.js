import Header from './Header'
import Body from './Body'

import chatControl from '../modules/chatControl'
const {
  fnStartChat,
} = chatControl

class ChatPlay {
  constructor({ router, }) {
    this.router = router
    this.body = new Body({ router: this.router, })
  }

  didMount(boolRetryReq = false) {
    // boolRetryReq is for detecting 'retry game or not'.

    // Exec child's didMount
    !!this.body.didMount &&
      this.body.didMount()

   
    // after rendered, start game.
    fnStartChat(boolRetryReq)
  }

  render() {
    return `${new Header().render()}
            ${this.body.render()}`
  }
}

export default ChatPlay