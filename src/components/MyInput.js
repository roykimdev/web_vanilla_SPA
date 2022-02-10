'strict mode'

import utils from '../utils'
const {
  fnFindElm,
} = utils

import './styles/MyInput.style.css'

import chatControl from '../modules/chatControl'
const {
  fnMatchingReq,
} = chatControl

import constants from '../utils/constants'
const {
  strIdInput,
  strTxtInputPlacholder,
} = constants

class MyInput {
  constructor({ router, }) {
    this.router = router
  }

  // Feature for submit of 'input box'
  fnEvtSubmit = e => {
    // 'Enter' key
    if (e.keyCode == 13) {
      e.preventDefault()
  
      const strUserInputs = e.target.value,
            boolInputNothing = !!!strUserInputs.length,
            boolClickeBeforeStart = boolInputNothing &&
                                      window.location.pathname == '/home'
  
      if (boolClickeBeforeStart) return alert('시작을 누르면 게임이 시작 됩니다.')
      if (!!!strUserInputs.length) return alert('Please type before submit.')
  
      fnMatchingReq({
        strUserInputs,
        myCbForDone: () => this.router.push('/report'),
      })
        
      e.target.value == ''
    }
  }

  didMount() {
    const elmTgt = fnFindElm(`#${strIdInput}`)

    // Add evt to detect 'submit with Enter key press'
    elmTgt.addEventListener('keydown', e => this.fnEvtSubmit(e))
  }

  render() {
    return `<div
              class="flexInit"
              >
              <input
                id="${strIdInput}"
                placeHolder="${strTxtInputPlacholder}"
                lang="en"
                />
            </div>`
  }
}

export default MyInput