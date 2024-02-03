import './style.scss'
import './global.css'
import { rabbit, heart } from './model/5x5'
import { cat2 } from './model/10x10'
import { hamster } from './model/15x15'
import {
  createClues,
  createRowClues,
  createColumnClues,
} from './utils/createClues'
import { createElement } from './utils/createElement'
import { createGrid } from './utils/createGrid'
import { View } from './view/View'
import { Controller } from './controller/Controller'
import { Model } from './model/Model'

export const state = {
  cellWidth: 50,
  counter: 0,
  blackCount: 0,
  isWin: false,
  theme: 0,
  saveKey: 2,
}

const view = new View()
const model = new Model()
const app = new Controller(view, model)

const mediaQuery900 = window.matchMedia('(min-width: 981px)')
const mediaQuery768 = window.matchMedia(
  '(min-width: 861px) and (max-width: 980px)',
)
const mediaQuery600 = window.matchMedia(
  '(min-width: 650px) and (max-width: 860px)',
)

const mediaQuery550 = window.matchMedia(
  '(min-width: 580px) and (max-width: 649px)',
)
const mediaQuery500 = window.matchMedia('(max-width: 579px)')

function handleScreenSizeChange(e) {
  if (mediaQuery900.matches) {
    state.cellWidth = 50
  } else if (mediaQuery768.matches) {
    state.cellWidth = 44
  } else if (mediaQuery600.matches) {
    state.cellWidth = 39
  } else if (mediaQuery550.matches) {
    state.cellWidth = 35
  } else if (mediaQuery500.matches) {
    state.cellWidth = 31
  } else {
    state.cellWidth = 50
  }

  view.resizeBoard(state.cellWidth)
}

mediaQuery900.addEventListener('change', handleScreenSizeChange)
mediaQuery768.addEventListener('change', handleScreenSizeChange)
mediaQuery600.addEventListener('change', handleScreenSizeChange)
mediaQuery550.addEventListener('change', handleScreenSizeChange)
mediaQuery500.addEventListener('change', handleScreenSizeChange)

handleScreenSizeChange({ matches: mediaQuery900.matches })
handleScreenSizeChange({ matches: mediaQuery768.matches })
handleScreenSizeChange({ matches: mediaQuery600.matches })
handleScreenSizeChange({ matches: mediaQuery550.matches })
handleScreenSizeChange({ matches: mediaQuery500.matches })
