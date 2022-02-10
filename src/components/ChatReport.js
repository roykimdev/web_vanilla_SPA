import chatControl from '../modules/chatControl'
const {
  chatData,
} = chatControl
import constants from '../utils/constants'
const {
  strTxtDescForDone,
  strSpace,
  strTxtDescScoreReportPrefix,
  strTxtDescScoreReportSuffix,
  strTxtDescResponseReportPrefix,
  strTxtDescResponseReportSuffix,
  strIdReportScore,
  strIdReportAvgTime,
  strBtnRestartTxt,
} = constants

import MyBtn from './MyBtn'

import './styles/ChatReport.style.css'

class ChatReport {
  constructor({ router, }) {
    this.router = router

    // Render 'MyBtn' with label 'strBtnRestartTxt'
    this.myBtn = new MyBtn({ router: this.router, strTxt: strBtnRestartTxt, })
  }

  didMount() {
    // Exec child's didMount
    !!this.myBtn.didMount &&
        this.myBtn.didMount()
  }

  render() {
    // Get Score & avg input time
    // Shows 'avg input time' : integer or float type
    const numScore = chatData.fnGetScore(),
          numResponseAvg = chatData.fnGetResponseAvg() / 1000,
          boolInt = numResponseAvg == parseFloat(numResponseAvg).toFixed(0)

    return `<span
              class="flexInit centerBoth reportDoneDesc"
              >
              ${strTxtDescForDone}
            </span>
            <div
              id="${strIdReportScore}"
              class="flexInit centerBoth row"
              >
              <span>${strTxtDescScoreReportPrefix}</span>
              <span>${strSpace}${numScore}</span>
              <span>${strSpace}${strTxtDescScoreReportSuffix}</span>
            </div>
            <div
              id="${strIdReportAvgTime}"
              class="flexInit center row"
              >
              <span>${strTxtDescResponseReportPrefix}</span>
              <span>${strSpace}${boolInt
                                  ? numResponseAvg
                                  : parseFloat(numResponseAvg).toFixed(1)}</span>
              <span>${strSpace}${strTxtDescResponseReportSuffix}</span>
            </div>
            <div
              class="flexInit col center"
              >
              ${this.myBtn.render()}
            </div>`
  }
}

export default ChatReport