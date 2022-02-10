'strict mode'

import utils from '../utils'
const {
  fnElmManipulate,
  fnFindElm,
  fnGetElmValue,
} = utils
import constants from '../utils/constants'
const {
  strSpace,
  strIdBodyWrap,
  strIdBodyTxt,
  strTxtDescForStart,
  strBtnStartTxt,
  strIdTimeLeft,
  strIdScore,
  strIdBtn,
  strIdInput,
  strBtnResetTxt,
  strTxtInputPlacholder,
  strTxtDescForDone,
  strBtnRestartTxt,
} = constants

import TextData from './TextData'
let textData = new TextData()

function ChatData(numTime = 0, strTxt = '', numScore = 0) {
  // This data is for Chat Play : Time, Word, Score.
  this.numTime = numTime
  this.strTxt = strTxt
  this.numScore = numScore

  // This is for calculating average input time per word.
  this.numCountsSubmit = 0
  this.numResponseTime = 0
  this.numInputStartTime = 0
  this.numInputEndTime = 0

  // This is to know Chat Play Status : stopped by user or not.
  this.boolChatPlayStatus = true

  // Getter : Time, Word, Score
  this.fnGetTime = () => this.numTime
  this.fnGetTxt = () => this.strTxt
  this.fnGetScore = () => this.numScore
  
  
  // Return average input time per word.
  this.fnGetResponseAvg = () => this.numResponseTime / this.numCountsSubmit
  this.fnGetTimeSpend = () => this.numInputEndTime - this.numInputStartTime

  this.fnGetChatPlayStatus = () => this.boolChatPlayStatus

  // Setter : Time
  // boolPassUIUpdate is for Test code.
  this.fnSetTime = (numTime = 0, boolPassUIUpdate = false) => {
    this.numTime = numTime

    boolPassUIUpdate ||
      fnElmManipulate({
        strTgt: `#${strIdTimeLeft}`,
        strTxt: `${strSpace}${String(numTime)}`,
      })
  }

  // Setter : Word
  // boolPassUIUpdate is for Test code.
  this.fnSetTxt = (strTxt = '', boolPassUIUpdate = false) => {
    this.strTxt = strTxt

    boolPassUIUpdate ||
      fnElmManipulate({
        strTgt: `#${strIdBodyTxt}`,
        strTxt,
      })
  }

  // Setter : Score
  // boolPassUIUpdate is for Test code.
  this.fnSetScore = (numScore = 0, boolPassUIUpdate = false) => {
    this.numScore = numScore

    boolPassUIUpdate ||
      fnElmManipulate({
        strTgt: `#${strIdScore}`,
        strTxt: `${strSpace}${String(numScore)}`,
      })
  }

  // Set
  this.fnSetCountsSubmit = (numCountsSubmit = 0) => this.numCountsSubmit = numCountsSubmit
  this.fnSetResponseTime = (numResponseTime = 0) => this.numResponseTime = numResponseTime


  // Set
  this.fnSetInputTimeStart = (numInputStartTime = new Date().valueOf()) => this.numInputStartTime = numInputStartTime
  this.fnSetInputTimeEnd = (numInputEndTime = new Date().valueOf()) => this.numInputEndTime = numInputEndTime
  this.fnResetInputTime = () => {
    this.fnSetInputTimeStart(0)
    this.fnSetInputTimeEnd(0)
  }

  // Setter
  this.fnSetChatPlayStatus = (boolChatPlayStatus = false) => this.boolChatPlayStatus = boolChatPlayStatus

  // Update score, then Set score.
  // boolPassUIUpdate is for Test code.
  this.fnUpdateScore = (boolIncrement = false, boolPassUIUpdate = false) => {
    const strTgt = `#${strIdScore}`,
          numScorePrev = this.numScore,
          numScoreNew = boolIncrement
                          ? numScorePrev + 1
                          : !!!numScorePrev
                                ? 0
                                : numScorePrev  - 1

    this.fnSetScore(numScoreNew, boolPassUIUpdate)
  }

  // Start : running timer of each stage.
  this.fnTimerStart = () => {
    this.fnTimerUpdate = window.setInterval(() => {
      const numTimeNew = this.numTime - 1
      
      // Prevent time should not be a minus value.
      numTimeNew >= 0 &&
        this.fnSetTime(numTimeNew)

      !!!numTimeNew &&
          (
            this.fnUpdateScore(),
            this.fnTimerClear()
          )
    }, 1000)
  }

  // Stop Running Timer.
  this.fnTimerClear = () => window.clearInterval(this.fnTimerUpdate)

  // Reset Chat Data(including UI update) :
  // Time, Score, Base data for cal avg input time.
  this.fnResetData = () => {
    this.fnSetTime(0)
    this.fnSetScore(0)
    this.fnSetCountsSubmit()
    this.fnSetResponseTime()
    this.fnResetInputTime()
  }

  // Set : Base data for cal avg input time.
  this.fnSetResponseData = () => {
    // Counts
    this.fnSetCountsSubmit(this.numCountsSubmit + 1)
    const numResTime = this.fnGetTimeSpend()
    // Set : Response time, accumulated.
    this.fnSetResponseTime(this.numResponseTime + numResTime)
  }

  // To match right or wrong.
  this.fnMatching = (strUserInputs = '') => {
    const boolResult = strUserInputs == this.strTxt

    // Score increase : only right & time left.
    boolResult &&
      this.numTime > 0 &&
        this.fnSetScore(this.numScore + 1)

    return boolResult
  }
}

// Instance of ChatData
let chatData = new ChatData()

const fnEndChat = () => {
        // Do, what you want right after Chat is done.
        // This is a sample for additional features(not now, may be future).
      },
      fnNextStage = (myCbForDone = false) => {
        // Get next word & text
        const objTextData = textData.fnGetWord(),
              {
                second,
                text,
              } = objTextData ||
                    {
                      second: 0,
                      text: '', 
                    }

        // Reset running timer & input time, for next stage.
        chatData.fnTimerClear()
        chatData.fnResetInputTime()

        // if exists : next word & text.
        // true : go on next word
        // false : stop Chat & move report page.
        !!objTextData
            ? (
                chatData.fnSetTime(second),
                chatData.fnSetTxt(text),
                chatData.fnTimerStart(),
                // Input box : focus, del placeholder & existing input
                fnUpdateElmInput({
                  boolDelPlaceholder: true,
                  boolDelInput: true,
                  boolFocus: true,
                }),
                // Timer start of next stage.
                chatData.fnSetInputTimeStart()
              )
            : (
                // Chat play done.
                chatData.fnSetTime(),
                chatData.fnSetTxt(),
                fnElmManipulate({
                  strTgt: `#${strIdBtn}`,
                  strTxt: strBtnRestartTxt,
                }),
                // Set : Chat Play Status, stopped(= meaning 'done')
                chatData.fnSetChatPlayStatus(),
                myCbForDone &&
                  myCbForDone(),
                fnEndChat()
              )
      },
      fnStartChat = (boolRetryReq = false) => {
        // Check Retry : navigated from 'Chat Report' or 
        //                  after 'stopped by user'
        boolRetryReq ||
          !chatData.fnGetChatPlayStatus()
            ? (
                chatData.fnSetChatPlayStatus(true),
                textData.fnResetWord(() => {

                  // Update btn label.
                  fnElmManipulate({
                    strTgt: `#${strIdBtn}`,
                    strTxt: strBtnResetTxt,
                  })
                  fnNextStage()
                })
              )
            : fnNextStage()
      },
      fnStopChat = () => {
        // Set : Chat Stopped by user
        chatData.fnSetChatPlayStatus()

        // Req : Stop Running Timer.
        chatData.fnTimerClear()

        // Reset Chat Data : Input box, restore placeholder
        fnUpdateElmInput({
          strTxtPlaceholder: strTxtInputPlacholder,
          boolDelInput: true,
        })

        // Change Description Guide : Press Start Btn.
        fnElmManipulate({
          strTgt: `#${strIdBodyTxt}`,
          strTxt: strTxtDescForStart,
        })

        // Reset Chat Data(including UI update) :
        // Time, Score, Base data for cal avg input time.
        chatData.fnResetData()
      },
      fnRetryChat = (myCb = false) => {
        chatData.fnResetData()

        // if myCb is exists : it is routing to '/play'
        myCb &&
          myCb()
      },
      fnUpdateElmInput = ({ strTxt = '', boolDelInput = false, strTxtPlaceholder = '', boolDelPlaceholder = false, boolFocus = false, }) => {
        // Input box manipulate.
        const elmTgt = fnFindElm(`#${strIdInput}`)

        !!elmTgt &&
          (
            !!strTxt &&
              (elmTgt.value = strTxt),
            boolDelInput &&
              (elmTgt.value = ''),
            !!strTxtPlaceholder &&
              (elmTgt.placeholder = strTxtPlaceholder),
            boolDelPlaceholder &&
              (elmTgt.placeholder = ''),
            boolFocus &&
              elmTgt.focus()
          )
      },
      fnMatchingReq = ({ strUserInputs = '', myCbForDone = false, }) => {
        const boolResult = chatData.fnMatching(strUserInputs)

        // if correct, cal time data for avg input time & request next stage.
        boolResult &&
          (
            chatData.fnSetInputTimeEnd(),
            chatData.fnSetResponseData(),
            fnNextStage(myCbForDone)
          )
      }

export default {
  fnStartChat,
  fnStopChat,
  fnRetryChat,
  fnMatchingReq,
  chatData,
  ChatData,
}