'strict mode'

import utils from '../utils'
const {
  fnGetElmValue,
  fnElmManipulate,
  fnFindElm,
} = utils

import chatControl from '../modules/chatControl'
const {
  fnStartGame,
  fnStopGame,
  fnRetryChat,
} = chatControl

import constants from '../utils/constants'
const {
  strBtnStartTxt,
  strBtnResetTxt,
  strIdBtn,
  strBtnRestartTxt,
} = constants

import './styles/MyBtn.style.css'

class MyBtn {
  constructor({ router, strTxt = '', }) {
    this.router = router

    // Set btn label
    // default is strBtnStartTxt in render
    this.strBtnTxt = strTxt
  }

  fnStartGameReq() {
    // Routing to '/play' to play
    this.router.push('/play')
  }

  fnRetryChatReq() {
    // Routing to '/play' & let it know 'retry req'.
    fnRetryChat(() => this.router.push('/play', true))
  }

  fnStopGameReq() {
    fnStopGame()
    this.router.push('/home')
  }

  didMount() {
    const strBtnTgt = `#${strIdBtn}`,
          elmTgt = fnFindElm(strBtnTgt)
      
    if (!!!elmTgt) return false

    // UX : for easy to input.
    elmTgt.focus()

    // Add 'Click' evt on btn.
    // Reuse : Game Start / Stop / Retry
    elmTgt.addEventListener('click', () => {
      const strBtnTgt = `#${strIdBtn}`,
            strBtnTxt = fnGetElmValue(strBtnTgt),
            boolStartReq = strBtnTxt == strBtnStartTxt,
            boolStopReq = !boolStartReq &&
                            strBtnTxt == strBtnResetTxt,
            boolRetryReq = !boolStartReq &&
                              !boolStopReq,
            strBtnTxtNew = boolStopReq
                            ? strBtnStartTxt
                            : strBtnResetTxt
    
      // Game Play Control : Start / Stop(= Reset) / Reset Game
      boolStartReq
        ? this.fnStartGameReq()
        : boolStopReq
          ? this.fnStopGameReq()
          : this.fnRetryChatReq()
    
      // Update button label
      // Play -> End : strBtnStartTxt <-> strBtnResetTxt
      // Play -> Stop : strBtnStartTxt -> strBtnResetTxt
      fnElmManipulate({
        strTgt: strBtnTgt,
        strTxt: strBtnTxtNew,
      })
    })

  }
  render() {
    return `<div
              class="flexInit"
              >
              <button
                id="${strIdBtn}"
                >
                ${this.strBtnTxt ||
                    strBtnStartTxt}
              </button>
            </div>`
  }
}

export default MyBtn
