import utils from '../utils'
const {
  fnFindElm,
} = utils

class Router {
  constructor({ objRouteComponents, }) {
    this.objRouteComponents = objRouteComponents

    // Listen back navigation, then render it.
    window.addEventListener('popstate', e => {
      const strPath = e.state.id
      this.render(strPath)
    })
  }

  render(path = '/home', boolRetryReq = false) {
    // Routing with 'route table of index.js'
    // Default is '/home'.
    const strPathAdj = path.slice(1),
          Component = strPathAdj &&
                        this.objRouteComponents.hasOwnProperty(strPathAdj)
                          ? this.objRouteComponents[strPathAdj].component
                          : this.objRouteComponents['home'],
          tgtComponent = new Component({
                              router: this,
                              push: this.push,
                            })

    this.elmRoot = fnFindElm('#root')
    this.elmRoot.innerHTML = tgtComponent.render()

    // After rendered, call 'didMount'
    tgtComponent.didMount &&
      tgtComponent.didMount(strPathAdj == 'play' &&
                              boolRetryReq)
  }

  // Routing & render reqs.
  push(path, boolRetryReq = false) {
    this.render(path, boolRetryReq)

    window.history.pushState(
      { id: path, },
      `${path}`,
      path
    )
  }
}

export default Router