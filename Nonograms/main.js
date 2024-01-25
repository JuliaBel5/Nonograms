import './style.scss'
import { cat, heart } from './model/5x5'
import { cat2 } from './model/10x10'
import { hamster } from './model/15x15'
import {
  createClues,
  createRowClues,
  createColumnClues,
} from './utils/createClues'
import { createElement } from './utils/createElement'
import { createGrid } from './utils/createGrid'

const gameArea = createElement('div', 'gamearea')
document.body.append(gameArea)
const cellWidth = 40

const { rows: rowClues, cols: colClues } = createClues(hamster)
const coeff = Math.ceil(rowClues[0].length / 2)

const size = 15
const game = createElement('div', 'game')
const square = createElement('div', 'square')
const container = createElement('div', 'container')
gameArea.append(container)

const grid = createGrid(game, hamster, cellWidth, size)

const row = createRowClues(colClues, cellWidth, coeff, size)
console.log(row)
const column = createColumnClues(rowClues, cellWidth, coeff, size)
column.style.height = `${cellWidth * size}px`
column.style.width = `${cellWidth * coeff}px`
row.style.height = `${cellWidth * coeff}px`
row.style.width = `${cellWidth * size}px`
game.style.height = `${cellWidth * size}px`
game.style.width = `${cellWidth * size}px`
container.style.width = `${cellWidth * size + cellWidth * coeff}px`
container.style.height = `${cellWidth * size + cellWidth * coeff}px`
square.style.width = `${cellWidth * coeff}px`
square.style.height = `${cellWidth * coeff}px`

container.append(square, row, column, game)
