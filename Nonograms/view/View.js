import { createElement } from '../utils/createElement'
import {
  createClues,
  createRowClues,
  createColumnClues,
} from '../utils/createClues'
import { createGrid } from '../utils/createGrid'
import { smallLevels } from '../model/5x5'
export class View {
  constructor(cellWidth) {
    this.picture = this.getRandomPicture(smallLevels)
    this.coeff = 1
    this.cellWidth = cellWidth
    this.size = this.picture.length
    this.init()
    this.gridEl = []
  }

  init() {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.game = createElement('div', 'game')
    this.square = createElement('div', 'square')
    this.container = createElement('div', 'container')

    this.newGameButton = createElement('div', 'newGameButton', 'New game')
    this.saveButton = createElement('div', 'saveButton', 'Save game')
    this.gameArea.append(this.newGameButton, this.saveButton, this.container)
    this.container.style.width = `${this.cellWidth * this.size + this.cellWidth * this.coeff}px`
    this.container.style.height = `${this.cellWidth * this.size + this.cellWidth * this.coeff}px`
    this.renderBoard()
  }

  getRandomPicture(array) {
    let index = Math.floor(Math.random() * array.length)
    console.log(index)
    return array[index]
  }

  bindCheckWin(handler) {
    this.game.addEventListener('click', () => {
      handler()
    })
  }

  createClues(picture) {
    return createClues(picture)
  }

  createGrid(game, picture, cellWidth, size) {
    return createGrid(game, picture, cellWidth, size)
  }

  createRowClues(colClues, cellWidth, coeff, size) {
    return createRowClues(colClues, cellWidth, coeff, size)
  }

  createColumnClues(rowClues, cellWidth, coeff, size) {
    return createColumnClues(rowClues, cellWidth, coeff, size)
  }

  renderBoard() {
    this.gridEl = []
    this.container.innerHTML = ''

    this.game = createElement('div', 'game')
    this.square = createElement('div', 'square')

    this.game.style.height = `${this.cellWidth * this.size}px`
    this.game.style.width = `${this.cellWidth * this.size}px`
    const { rows: rowClues, cols: colClues } = this.createClues(this.picture)
    this.coeff = Math.ceil(rowClues[0].length / 2)
    this.gridEl = this.createGrid(
      this.game,
      this.picture,
      this.cellWidth,
      this.size,
    )

    this.row = this.createRowClues(
      colClues,
      this.cellWidth,
      this.coeff,
      this.size,
    )

    this.column = this.createColumnClues(
      rowClues,
      this.cellWidth,
      this.coeff,
      this.size,
    )

    this.column.style.height = `${this.cellWidth * this.size}px`
    this.column.style.width = `${this.cellWidth * this.coeff}px`
    this.row.style.height = `${this.cellWidth * this.coeff}px`
    this.row.style.width = `${this.cellWidth * this.size}px`

    this.container.append(this.square, this.row, this.column, this.game)
  }
}
