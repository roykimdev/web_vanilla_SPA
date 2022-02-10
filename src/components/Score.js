'strict mode'

import utils from '../utils'
const {
  fnCreateTxtElm,
  fnCreateElm,
} = utils
import constants from '../utils/constants'
const {
  strSpace,
  strIdScore,
  strIdScoreWrap,
} = constants

import './styles/Score.style.css'

class Score {
  render() {
    return `<div
              id="${strIdScoreWrap}"
              class="flexInit centerBoth"
              >
              <span>점수 : </span>
              <span id="${strIdScore}">${strSpace}${0}</span>
              <span>점</span>
            </div>
            `
  }
}

export default Score