'strict mode'

import constants from '../utils/constants'
const {
  strSpace,
} = constants

const fnFindElm = (strTgt = '') => {// to find target elm.
        if (!!!strTgt) return console.error(
                                'fnFindElm - Check needed : strTgt is empty !',
                                { strTgt, }
                              )
        return document.querySelector(strTgt)
      },
      fnAddAttrs = ({ elm = false, objAttrs = {}, }) => {
        // Add attrs on elm with setAttribute
        if (!!!elm) return console.error('fnAddAttrs - Check needed : Elm is empty !')

        Object.entries(objAttrs).forEach(v => elm.setAttribute(v[0], v[1]))
        
        return elm
      },
      fnElmManipulate = ({ strTgt = '', strTxt = '', }) => {
        // Direct elm manipulate
        if (!!!strTgt) return console.error(
                              'fnElmManipulate - Check needed : strTgt is empty !',
                              { strTgt, strTxt, }
                            )
        const elmTgt = fnFindElm(strTgt)
        // It will be also shown, the target element is not rendered yet.
        if (!!!elmTgt) return console.warn(
                                'fnElmManipulate - Not exists : target elm !',
                                { strTgt, strTxt, }
                              )
        const numNodeType = elmTgt.nodeType,
              boolTxtNode = numNodeType == 3

        // Update : considering node type.
        boolTxtNode
          ? (elmTgt.data = strTxt)
          : (elmTgt.innerText = strTxt)
      },
      fnCreateElm = ({ strTag = 'div', objAttrs = false, arrElmChild = [], }) => {
        let elmTgt = document.createElement(strTag)

        !!objAttrs &&
          fnAddAttrs({
            elm: elmTgt,
            objAttrs,
          })

        arrElmChild.forEach(elm => elm && elmTgt.appendChild(elm))

        return elmTgt
      },
      fnCreateTxtNode = ({ strTxt = '', }) => {
        if (!!!strTxt) return console.error(
                                'fnCreateTxtNode - Check needed : strTxt is empty !',
                                { strTxt, }
                              )
        return document.createTextNode(strTxt)
      },
      fnCreateTxtElm = ({ strTag = 'span', strTxt = '', objAttrs = false, }) => {
        if (!!!strTxt) return console.error(
                                'fnCreateTxtElm - Check needed : strTxt is empty !',
                                { strTag, strTxt, objAttrs, }
                              )
        let elmTxtTgtOuter = document.createElement(strTag),
            elmTgtTxtNode = fnCreateTxtNode({ strTxt, })

        !!objAttrs &&
          fnAddAttrs({
            elm: elmTxtTgtOuter,
            objAttrs,
          })

        elmTxtTgtOuter.appendChild(elmTgtTxtNode)

        return elmTxtTgtOuter
      },
      fnAddElm = ({ strTgt = '', arrElms = [], }) => {
        if (!!!strTgt) return console.error(
                                'fnAddElm - Check needed : strTgt is empty !',
                                { strTgt, arrElms, }
                              )

        arrElms.forEach(elm => {
          const elmTgt = fnFindElm(strTgt)
          if (!!!elmTgt) return console.error('fnAddElm - Not exists : target elm !')

          elmTgt.appendChild(elm)
        })
      },
      fnGetElmValue = (strTgt = '') => {// get : elm value.
        if (!!!strTgt) return console.error(
                                'fnGetElmValue - Check needed : strTgt is empty !',
                                { strTgt, }
                              )
        const elmTgt = fnFindElm(strTgt)
        if (!!!elmTgt) return console.error(
          'fnGetElmValue - Not exists : target elm !',
          { strTgt, }
        )
        const numNodeType = elmTgt.nodeType,
              boolTxtNode = numNodeType == 3

        return boolTxtNode
                ? elmTgt.data
                : elmTgt.innerText
      }

export default {
  fnCreateTxtNode,
  fnCreateTxtElm,
  fnCreateElm,
  fnAddElm,
  fnElmManipulate,
  fnGetElmValue,
  fnFindElm,
}