'strict mode'

import constants from '../utils/constants'
const {
  strSpace,
  strIdTimerWrap,
  strIdTimeLeft,
} = constants

import './styles/Timer.style.css'

class Timer {
  render() {
    return `<div
              id="${strIdTimerWrap}"
              class="flexInit centerBoth"
              >
              <span>남은 시간 :</span>
              <span id="${strIdTimeLeft}">${strSpace}${String(0)}</span>
              <span>초</span>
            </div>`
  }
}

export default Timer