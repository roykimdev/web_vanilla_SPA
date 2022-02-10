## Environment
  - node : v14.18.2(verified), recommend(v14.x or later).
  - Browsers(tested, 3) : Chrome(main, 98.0.4758), Safari(14.0.1), Firefox(96.0.1)
  - Limitation : vanilla JS, without library(except webpack libraries).

## How to Run
* localhost:8080
* common : don't forget.
 * ```% npm i```
* Dev
 * ```% npm run start```
 * hosting with webpack dev server.
* Production
 * ```% npm run build```
* Test
 * ```% npm run test``` : exec once
 * ```% npm run testW``` : exec with watch option

## Structure
```
project
│   README.md
│
└───congig
│   │   webpack.config.dev.js
│   │   webpack.config.prod.js
│   │   
│   └───jest
│       │   cssTransform.js
│
└───public : static files
│   │   index.html
│   │   xxxx.js(hashed, webpack)
│   │   xxxx.css(hashed, webpack)
│   │   ...
│
└───__tests__ : test files
│   │   chatControl.test
│   │   TextData.test
│   │   
│   └───__snapshots__ 
│       │   ...
│       
└───scripts : npm scripts
│   │   build.js
│   │   start.js
│
└───src
    │   index.js
    │   index.html
    │
    └───components 
    │   │   Home.js
    │   │   ChatPlay.js
    │   │   ChatReport.js
    │   │   ...
    │   │
    │   └───styles
    │       │   Root.style.css
    │       │   ChatReport.style.css
    │       │   Header.style.css
    │       │   ...
    │   
    └───modules
    │   │   chatControl.js
    │   │   Router.js
    │   │   TextData.js
    │   │   ...
    │   
    │   
    └───utils
        │   constants.js : static variables
        │   index.js : features(DOM control, etc.)
        
```

### Router
* Concept : **Client-side routing** & **SPA**Sing Page Application().
 1. **SPA 방식**으로 component를 **render**하였고, **component는** 분리하여 **모듈화** 함.
 1. SPA에 적합한 routing 방식을 vanilla js로 구현 함.
 1. src/index.js에서 variable objRouteComponents에 *routing에 필요한 component와 path를 dictionary type으로 저장* 함.
   1. *routing table이 커져도 fast access*가 가능하도록 설정 함.
   1. routing table에 존재하지 않는 경우에는 `/home`이 default가 되도록 설정 함.

* Routing Process.
 1. routing 기능이 필요한 각 component에서는 Router.js에서 구현한 push(= custom method)를 통해서 routing 요청을 할 수 있음.
 1. render에서는 현재 요청한 path의 component를 routing table에서 찾아서 해당 component를 render함.
 1. render 후에는 해당 component에서 *didMount*가 존재하는 경우 실행하도록 함.
 1. 'back navigation' 요청은 *popstate* event를 통해서 target component render가 처리 되도록 함.
   1. 작동 case(e.g.) : `/` -> `/home` -> `/play` -> (back navigation) -> `/home`
* Router는 hash status를 활용한 방안으로 구현하다가, *anchor를 통한 이동이 아니므로* 일반 User에게 친숙한 URL 구조가 좋다고 생각하여 현재 적용된 방식으로 구현 했습니다.
 * 현재 적용된 URL(e.g.) : `localhost:8080/home`, `localhost:8080/play`
 * hash status 구성 시 URL(e.g.) : `localhost:8080/#/home`, `localhost:8080/#/play`
 

* Routing table
 * `/` : init
 * `/home` : init 직 후에 자동 이동 됨. 과제에서 요구한 '라우터 직접 구현'을 위해서 임의로 추가 함.
 * `/play` : chat '시작' 버튼 누른 경우 이동 됨. '다시 시작' 누른 경우 이동 함.
 * `/report` : chat 결과 보여주기 위해 이동 함.
 * User flow : samples.
  * 사이트 접속 -> chat 시작 -> (chat을 **끝까지 플레이**) -> '다시 시작'으로 새로운 **chat 시작**
    * `/` -> `/home` -> `/play` -> `/report` -> `/play`
   * 사이트 접속 -> chat 시작 -> (chat 플레이) -> ('초기화' 눌러서 **chat 플레이 중단**) -> chat 시작 화면으로 이동.
    * `/` -> `/home` -> `/play` -> `/home`

## Library
 * vanilla javascript(except webpack libraries).
 * Webpack
   - 2 config files : dev & prod.
   - dev : minimize를 제외하고 sourcemap과 debug mode를 사용 설정 함.
   - prod : chunk를 추가, minimize 추가 등.
   - 공통(dev & prod)
     - 현재 적용되어 있지 image, sa(c)ss와 assets 관련 부분은 배제 함.
     - babel은 support browser coverage 증대를 위해서 core-js 등 활용 가능.

## [Details] Modules(3)
1. chatControl
 * chat을 시작 / 중지 / 재시작 하는 기능이 포함되어 있음.
 * chat 플레이 데이터인 시간, 점수와 평균 입력 시간 등이 포함되어 있음.
1. **Router**
 1. (앞의 Router 부분과 중복되므로 생략 함.)
1. TextData
 1. chat에 사용되는 '단어 데이터'를 처리.
    - 중요 : '단어 데이터'는 갱신 2 cases(chat init & '다시 시작' 클릭 직 후).
 1. 서버에 단어 요청.
    - 서버에서 데이터를 받지 못 한 경우, 이전에 받은 온전한 데이터를 사용 함.
 1. chat에 사용할 단어 보관 & 제공.


## [Details]  Components(vanilla js) : like React Class Component

* Header.
 - Nested Elements : Left time(Timer.js), Score(Score.js).
 - 노출 pages : `/home`, `/play`
 - Time : 남은 시간의 최초 값은 zero임.
 - Score : chat 시작전 최초 값은 zero임.
 
* Body
 - Nested Elements : 입력창(MyInput), 버튼(MyBtn)
 - 노출 pages : `/home`, `/play`
 - MyInput : '시작' 버튼 누르면 auto focus 됨, 입력 혼동을 방지하기 위해서 placeholder는 보이지 않음. chat 시작 화면(= /play)에서는 placeholder가 보이도록 함.
 - MyBtn : 'chat 시작 / 중지 / 다시 시작'에 사용 됨.
   - 초반에 Direct DOM manipulate 방식으로 작업 시 btn label을 통해서 chat status를 판단하도록 했음.
   - url path를 통해서 'chat 시작 / 중지 / 다시 시작'을 판별하는 것으로 수정 할 수도 있음.
 

* Wait Indicator
 - 사용 목적 : '단어 데이터'를 준비하는 동안 'User action wait guide'를 위해서 사용 함.
   - '단어 데이터'가 초기화 되는 순간 보였다가, 초기화가 끝나서 사라짐.
   - 기능 : **User에게** 단어 **데이터 준비 상태**를 알려주고, 데이터 준비 전 **chat 시작을 방지** 함.
  
  * 기타
    * 일부 case에서는 component를 재사용함.

## UI 관련.
  * simple하게 최대 크기만 제한함 : max-width(1024px), max-height(968px)
  * UI보다는 다른 부분에 비중을 둠.

## UX 관련.
1. chat 시작 대기 화면에서 '남은 시간'과 '점수'를 UI에서 미리 보여줌으로써 chat 시작 전에 해당 data의 위치를 미리 알려주어서 **쉽게 chat을 진행** 할 수 있도록 함.
1. chat 시작 대기 화면에서 keyboard cursor를 '시작 버튼'에 위치하여 바로 **chat 시작이 용이** 하도록 **action을 유도** 함.
1. chat 시작 대기 화면에서 highlight text로 'click start.'를 추가하여, **user에게 다음 action에 대한 명확한 guide를 제시** 함.
1. input box
 1. **'start' 버튼 누르면 auto focus 됨**
 1. start 후에는 **입력 혼동을 방지**하고 빠른 입력을 도모하기 위해서 *placeholder는 보이지 않음*.
 1. chat 시작 화면(= `/play`)에서는 안내를 위해서 *placeholder가 다시 보이도록 함*.
1. chat 도중에 input box에서 empty string을 submit(= enter key press)한 경우, alert으로 입력이 필요함을 안내 함.
    * 버튼(= 시작, 초기화, 다시 시작)은 mouse click or keyboard enter가 동일하게 인식됨.
1. '점수'는 zero에서 시작하며, *제한시간 이내에 맞추지 못하면 1점씩 감점* 된다. 그렇지만 **음수가 될 수 없도록 함.**. 일반적으로 '점수가 음수인 경우가 없음'으로 음수가 되지 않도록 적용 함. 현재 임시 제한 시간은 각 20초임.
1. *제한시간 이후에는 정답을 맞추더라도 점수를 획득하지 못 함*, 그렇지 않은 경우 제한 시간이 의미를 갖지 못하기 때문.
1. '단어당 평균 답변 시간'은 integer인 경우 정수로, (정확도를 위하여) 소수점을 포함하는 경우 소수 첫째짜리까지만을 노출 함(소수점이하 둘째자리가 존재하는 경우에는 반올림 함).


## Intention & Opinions
1. Component render 방식.
 1. 처음에는 Direct DOM manipulating으로 구현을 했었으나, 확장성과 유지 보수 편의성을 고려하여 재사용 등이 가능한 형태로 **OOP와 functional programing을 혼합**하여 실제로 모두 활용 할 수 있는 역량 보유를 보여주고 싶었습니다.
 1. e.g. Direct DOM Manipulating을 사용 : Wait Indicator(= 단어 데이터 준비 시 보여주는custom UI)
1. 일부 **components**는 실제로 **재사용**이 가능한 것을 보여주고자, (관점에 따라서는 중복으로 보일 수 있지만) 재사용을 보여주기 위해서 의도적으로 사용하였습니다.
1. API request는 online multi chat처럼 가장 **최신 data를 사용하고자**, (site init을 제외하고는) **chat이 시작되면 API request를 요청**하도록 하였습니다.
 1. 웹 사이트 최초 접속 시(= site init이라고 표현한 case)에는 바로 chat을 즐길 수 있도록 init된 data를 활용 함.
  - Server data 변동 조건과 필요성을 확인하여 '단어 데이터' update 시기는 수정하여 performance 향상 가능. 
1. Style file은 sass를 사용 할 수도 있으나 'library 제한 rule'을 피하고자 css로 대체해도 작업에 문제가 없어서 css를 사용했습니다. 
 1. 각 component마다 css file을 분리하여 다른 **협업자**(= designers & publishers 등)**와 공동 작업 시 편의를 도모** 할 수 있도록 구조를 설계하였습니다. 추가로, 'Root.style.css'을 추가하여 공통으로 사용 할 style을 담을 수 있도록 구성하였습니다.
1. constants.js 추가를 통해서 다른 **협업자들**(= developers & publishers 등)**과 수정 작업 시 편의성을 도모**하고자 헀습니다. 
    * e.g.(1) 'UI text 수정', 'target element id', 'server url info", 
    * e.g.(2) 'Mission Complete!'를 수정하고자 할 경우, constants.js의 variable 'strTxtDescForDone'을 수정하면 **다른 file을 수정하지 않아도 일괄 반영되도록 작업**하였습니다.
    * 기타 : naming은 임의로 하였으며, 다수의 **협업자와의 작업을 위해서 data구조는 단순한 형태로** (임시로) **구성**하였습니다. 물론, 협업자와의 협의나 관련 *rule이 있다면 준수하여 반영 가능* 합니다.
1. Support Browsers : ES6 중심으로 support browser coverage rate이 높은 것들을 우선 사용.
 * e.g. : API call에서도 XMLHttpRequest(XHR)을 사용 함. fetch는 상대적으로 support browsers가 적음(e.g. IE unsupports).
 * e.g. : Getter/Setter에서도 ES6의 Proxy를 이용 할 수 있으나, Class를 사용함. Proxy는 단순 coverage rate은 상당히 높으나 IE를 지원하지 않음.
1. test code를 추가하여 chatControl과 TextData의 데이터 처리 관련 부분 테스트를 수행.
1. rendered HTML은 본 프로젝트에 적용한 vanilla js custom 방식을 test library에서 직접 하지 않아서 그 한계로 인하여 명확하게 'passed'가 아닌 'obsole'나와서 대상에서 제외 함.
 * direct element append 방식을 사용하는 *'Wait Indicator'는* TextData.test.js에 포함하여 **snapshot까지 pass로 테스트 수행** 함.
1. 현재 단계에서는 편의상 typescript를 사용하지 않았으나, 이에 대한 대안으로 data구조를 최소한으로 simple하게 구성하였으며 hungarian 표기법을 사용하여 variable마다 data type을 명시하여 단번에 data type을 파악에 도움이 될 수 있도록 도모 함.
    
## Etc. : Improvements.
 * What if ... : without limitation library.
  * With sass, less coding, more effiency.
  * With View(= among MVC*) library, easy to control component render life cycle, etc. And it's easy to UI test.
  * With data store library(= like redux), access & storing data would more easyily & effiently.