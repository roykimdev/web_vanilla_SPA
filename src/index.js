import utils from './utils'
const {
  fnAddElm,
} = utils

import constants from './utils/constants'
const {
  strTxtDescForStart,
} = constants

import './components/styles/Root.Style.css'
// Style for 'Wait Indicator'
import './components/styles/MyWaitIndicator.Style.css'

import Router from './modules/Router'
import Home from './components/Home'
import ChatPlay from './components/ChatPlay'
import ChatReport from './components/ChatReport'


window.addEventListener('DOMContentLoaded', () => {
  // Routing table : including target components.
  const objRouteComponents = {
          home: {
            component: Home,
            path: '/home',
          },
          play: {
            component: ChatPlay,
            path: '/play',
          },
          report: {
            component: ChatReport,
            path: '/report',
          },
        },
        router = new Router({ objRouteComponents, })

  // After rendered, auto direct to '/home'
  // This is just for routing sample test.
  router.push('/home')
})