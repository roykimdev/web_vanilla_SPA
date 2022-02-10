import chatControl from '../src/modules/chatControl'
const {
  ChatData,
} = chatControl

let textData;

describe('chatControl', () => {
  beforeEach(() => {
    textData = new ChatData()
  })

  it('Set Time & Get it', () => {
    textData.fnSetTime(10, true)
    expect(textData.fnGetTime()).toEqual(10)
  })

  it('Set Score & Get it', () => {
    textData.fnSetScore(2, true)
    expect(textData.fnGetScore()).toEqual(2)
  })

  it('Result : Correct, Score + 1 & Get it', () => {
    textData.fnSetScore(5, true)
    textData.fnUpdateScore(true, true)
    expect(textData.fnGetScore()).toEqual(6)
  })

  it('Timeout : Score - 1 & Get it', () => {
    textData.fnSetScore(8, true)
    textData.fnUpdateScore(false, true)
    expect(textData.fnGetScore()).toEqual(7)
  })

  it('Set Text word & Get it', () => {
    textData.fnSetTxt('hello', true)
    expect(textData.fnGetTxt()).toEqual('hello')
  })
  
})