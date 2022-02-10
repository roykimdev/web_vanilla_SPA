import Header from './Header'
import Body from './Body'

import constants from '../utils/constants'
const {
  strTxtDescForStart,
} = constants

class Home {
  constructor({ router, }) {
    this.router = router
    this.body = new Body({
                  router: this.router,
                  strTxt: strTxtDescForStart,
                })
  }

  didMount() {
    // Exec child's didMount
    !!this.body.didMount &&
      this.body.didMount()
  }

  render() {
    return `${new Header().render()}
            ${this.body.render()}`
  }
}

export default Home