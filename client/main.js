import { forEach, fromEvent, interval, map, merge, pipe } from 'callbag-basics-esmodules'
import { render, html } from 'uhtml'
import './style.css'

const ROOT = document.querySelector('#app')
const SOCKET = new WebSocket('ws://localhost:3000/ws')

const App = (state) => html`
  <input type="text" onchange=${onChange}/>
  <pre><code>
  ${JSON.stringify(state, null, 2)}
  </code></pre>
`

function update (state) {
  render(ROOT, App(state))
}

const load = fromEvent(window, 'load')
const wsOpen = fromEvent(SOCKET, 'open')
const wsMsg = pipe(
  fromEvent(SOCKET, 'message'),
  map(({ data }) => JSON.parse(data)),
)

pipe(
  merge(load, wsOpen, wsMsg),
  forEach(update)
)

function onChange (event) {
  SOCKET.send(JSON.stringify({ value: event.target.value }))
}
