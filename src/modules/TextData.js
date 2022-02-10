import utils from '../utils'
const {
  fnFindElm,
  fnCreateElm,
  fnCreateTxtElm,
} = utils

import constants from '../utils/constants'
const {
  strURLReqWords,
  strIdActivityIndicator,
} = constants

class TextData {
  constructor() {
    this.arrWordsOri = []
    this.arrWords = []
    this.elmWait = false

    this.fnTextDataUpdateReq()
    this.fnGetTextData()
    this.fnGetElmWait()
  }

  fnSetWords = (arrData = []) => {
    this.arrWordsOri = [ ...arrData ]
    this.arrWords = [ ...arrData ]
  }

  // Get 1st word for next stage.
  fnGetWord = () => this.arrWords.shift()

  // Make elms : 'Wait Indicator'
  fnGetElmWait = () => {
    const elmWaitCircle = fnCreateElm({
                            objAttrs: {
                              class: 'waitCircle',
                            },
                          }),
          elmWaitTxt = fnCreateTxtElm({
                        objAttrs: {
                          class: 'waitTxt',
                        },
                        strTxt: 'Loading...',
                      }),
          elmWait = fnCreateElm({
                          objAttrs: {
                            id: strIdActivityIndicator,
                          },
                          arrElmChild: [
                            elmWaitCircle,
                            elmWaitTxt,
                          ]
                        })

    this.elmWait = elmWait
    return elmWait
  }

  // Render : 'Wait Indicator'
  fnUIAddActivityIndicator() {
    this.elmTgt = fnFindElm('body')
    this.elmTgt.appendChild(this.elmWait || this.fnGetElmWait())
  }

  // Del rendered 'Wait Indicator'
  fnUIDelActivityIndicator() {
    const elmTgtWait = fnFindElm(`#${strIdActivityIndicator}`)
    !!elmTgtWait &&
        elmTgtWait.remove()
  }

  // Update 'words' data with API call.
  // If updated data is empty,
  //  'words' would be updated with previous 'words' data.  
  fnTextDataUpdateReq = async (myCb = false) => {
    this.fnUIAddActivityIndicator()

    const arrWordsNew = await this.fnGetTextData()
    
    this.fnSetWords(!!arrWordsNew.length
                        ? [ ...arrWordsNew, ]
                        : [ ...this.arrWordsOri, ])

    // if myCb exists,
    // it is for 'update btn label' & requesting next stage
    myCb &&
      myCb()
  }
  
  // Update 'words' data with API call if exists.
  fnGetTextData = () => {
    return new Promise((resolve, reject) => {

      // case(temp) : without API call.
      return setTimeout(() => {
        this.fnUIDelActivityIndicator()
        return resolve([
          {
            'second': 30,
            'text': 'Hi, type just like me.'
          },
          {
            'second': 30,
            'text': 'Nice to meet you.'
          }
        ])
        // 1000ms means wait time for (fake) API call.
      }, 1000)
      

      // case : with API call.
      let xhr = new XMLHttpRequest()
  
      xhr.onload = () => {
        const {
                status,
              } = xhr,
              boolSuccess = status >= 200 &&
                              300 > status
    
        if (boolSuccess) {
          const responseText = xhr.responseText
          let arrData = JSON.parse(responseText)
    
          // Del requests : Elm  'Wait Indicator'
          this.fnUIDelActivityIndicator()
          return resolve(arrData)
        } else {
          return resolve([])
        }
      }
  
      xhr.onerror = e => {
        console.error('fnGetTextData : ', e)
        return reject(e)
      }
      xhr.open('GET', strURLReqWords)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send()
    })
  }

  // Request : Reset 'words' data.
  fnResetWord = (myCb = false) => {
    this.fnTextDataUpdateReq(myCb)
  }
}


export default TextData 