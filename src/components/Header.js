import './styles/Header.style.css'

import Timer from './Timer'
import Score from './Score'

class Header {
  render() {
    return `<div
              id="header"
              class="flexInit row"
              >
              ${new Timer().render()}
              ${new Score().render()}
            </div>`
  }
}

export default Header