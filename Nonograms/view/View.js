import { createElement } from '../utils/createElement'
import {
  createClues,
  createRowClues,
  createColumnClues,
} from '../utils/createClues'
import { createGrid } from '../utils/createGrid'
import { level5 } from '../model/5x5'
import { state } from '../main'
import { Modal } from '../model/modal'

export class View {
  constructor() {
    this.picture = this.getRandomPicture(level5).value
    this.coeff = 1
    this.cellWidth = state.cellWidth
    this.size = this.picture.length
    this.init()
    this.gridEl = []
    //this.startTime = null
  }

  init() {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.game = createElement('div', 'game')
    this.square = createElement('div', 'square')
    this.container = createElement('div', 'container')
    this.buttonContainer = createElement('div', 'buttonContainer')
    this.newGameButton = createElement('div', 'newGameButton', 'New game')
    this.saveButton = createElement('div', 'saveButton', 'Save game')

    this.sizeSelector = createElement('select', 'sizeSelector')
    ;['5', '10', '15'].forEach((option) => {
      const optionElement = document.createElement('option')
      optionElement.textContent = option
      optionElement.value = option
      this.sizeSelector.appendChild(optionElement)
    })

    this.sizeSelector.value = '5'
    this.buttonContainer.append(
      this.newGameButton,
      this.saveButton,
      this.sizeSelector,
    )
    this.gameArea.append(
      this.buttonContainer,

      this.container,
    )
    this.renderBoard()
  }

  getRandomPicture(array) {
    let index = Math.floor(Math.random() * array.length)
    return array[index]
  }

  bindCheckWin(handler) {
    this.game.addEventListener('click', () => {
      handler()
    })
  }

  bindNewGame(handler) {
    this.newGameButton.addEventListener('click', () => {
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

    console.log('это релоад', this.size, this.cellWidth)

    this.game = createElement('div', 'game')
    this.square = createElement('div', 'square')
    const gameSize = this.cellWidth * this.size
    this.game.style.height = `${gameSize}px`
    this.game.style.width = `${gameSize}px`
    const { rows: rowClues, cols: colClues } = this.createClues(this.picture)

    this.coeff = Math.ceil(rowClues[0].length / 1.5)

    const squareSize = this.cellWidth * this.coeff
    this.square.style.height = `${squareSize}px`
    this.square.style.width = `${squareSize}px`
    //square.style.backgroundImage = "url(`../public/${ pictures[this.view.size].name}.png`)";
    //square.style.backgroundImage = "url('../public/Я-ЕСТЬ-НАЗВАНИЕ.jpg')";
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

    this.container.style.width = `${gameSize + squareSize}px`
    this.container.style.height = `${gameSize + squareSize}px`
    this.column.style.height = `${gameSize}px`
    this.column.style.width = `${squareSize}px`
    this.row.style.height = `${squareSize}px`
    this.row.style.width = `${gameSize}px`

    this.container.append(this.square, this.row, this.column, this.game)
  }

  resizeBoard(cellWidth) {
    if (this.size === 5) {
      cellWidth = 50
    }

    if (this.size === 15) {
      cellWidth *= 0.85
    }

    console.log('это ресайз', this.size, cellWidth)

    Array.from(this.game.children).forEach((el) => {
      el.style.height = `${cellWidth}px`
      el.style.width = `${cellWidth}px`
    })

    const gameSize = cellWidth * this.size
    const squareSize = cellWidth * this.coeff
    this.game.style.height = `${gameSize}px`
    this.game.style.width = `${gameSize}px`
    this.square.style.height = `${squareSize}px`
    this.square.style.width = `${squareSize}px`
    this.container.style.width = `${gameSize + squareSize}px`
    this.container.style.height = `${gameSize + squareSize}px`
    this.column.style.height = `${gameSize}px`
    this.column.style.width = `${squareSize}px`

    Array.from(this.row.children).forEach((el) => {
      el.style.height = `${squareSize}px`
      el.style.width = `${cellWidth}px`
    })

    Array.from(this.column.children).forEach((el) => {
      el.style.height = `${cellWidth}px`
      el.style.width = `${squareSize}px`
    })

    this.row.style.height = `${squareSize}px`
    this.row.style.width = `${gameSize}px`
  }

  bindSizeSelector(handler) {
    this.sizeSelector.addEventListener('change', (event) => {
      handler(event.target.value)
    })
  }
}
