import { fireEvent, getByText } from '@testing-library/dom'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

import TextData from '../src/modules/TextData'

let textData, dom, container;

const html = fs.readFileSync(path.resolve(__dirname + '/../src', './index.html'), 'utf8');

describe('TextData', () => {
  beforeEach(() => {
    textData = new TextData()

    dom = new JSDOM(html, { runScripts: 'dangerously', })
    container = dom.window.document.body
  })

  it('Set Words & Get 1 word for game', () => {
    textData.fnSetWords([
      {
        second: 9,
        text: 'world',
      },
      {
        second: 3,
        text: 'this',
      },
    ])
    expect(textData.fnGetWord()).toEqual({
                                  second: 9,
                                  text: 'world',
                                 })
  })

  it('Render : Wait Indicator', () => {
    const elmWait = textData.fnGetElmWait()
    expect(elmWait).toMatchSnapshot();
  })

  
})