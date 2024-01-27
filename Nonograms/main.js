import './style.scss'
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
  counter: 0,
  blackCount: 0,
  isWin: false,
}

const view = new View(50, 5)
const model = new Model()
const app = new Controller(view, model)
