'strict mode'

import utils from '../utils'
const {
  fnCreateTxtElm,
  fnCreateElm,
} = utils

import constants from '../utils/constants'
const {
  strIdBodyWrap,
  strClassBodyWrap,
  strIdBodyTxt,
  strClassBodyTxt,
  strTxtDescForStart,
} = constants

import MyBtn from './MyBtn'
import MyInput from './MyInput'

import './styles/Body.style.css'

class Body {
  constructor({ router, strTxt =  '', }) {
    this.router = router
    this.myBtn = new MyBtn({ router: this.router, })
    this.myInput = new MyInput({ router: this.router, })

    // Set Body Description Text
    // strTxt exists at '/home'
    this.strTxt = strTxt
  }

  didMount() {
    // Exec children's didMount
    !!this.myBtn.didMount &&
        this.myBtn.didMount()

    !!this.myInput.didMount &&
        this.myInput.didMount()
  }

  render() {
    return `<div
              id="${strIdBodyWrap}"
              class="flexInit col center"
              >
              <span
                id="${strIdBodyTxt}"
                class="flexInit centerBoth"
                >
                ${this.strTxt}
              </span>
              ${this.myInput.render()}
              ${this.myBtn.render()}
            </div>`
  }
}

export default Body