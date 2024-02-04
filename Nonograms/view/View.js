import { createElement } from '../utils/createElement'
import {
  createClues,
  createRowClues,
  createColumnClues,
} from '../utils/createClues'
import { createGrid } from '../utils/createGrid'
import { level5, level10, level15 } from '../model'
import { state } from '../main'
import { Timer } from '../utils/Timer'

const pictures = {
  5: level5,
  10: level10,
  15: level15,
}

export class View {
  constructor() {
    this.randomChoice = this.getRandomPicture(level5)
    this.picture = this.randomChoice.value
    this.levelPicture = this.randomChoice.name
    this.coeff = 1
    this.cellWidth = state.cellWidth
    this.size = this.picture.length
    this.init()
    this.gridEl = []
    this.timer = new Timer(this.timerWindow)
  }

  init() {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.game = createElement('div', 'game')
    this.square = createElement('div', 'square')
    this.container = createElement('div', `container${state.theme}`)
    this.buttonContainer = createElement('div', `buttonContainer${state.theme}`)
    this.iconsWrapper = createElement('div', 'iconsWrapper')
    this.buttonsWrapper = createElement('div', 'iconsWrapper')
    this.saveButtonsWrapper = createElement('div', 'iconsWrapper')
    this.solutionsButtonsWrapper = createElement('div', 'iconsWrapper')
    this.selectsWrapper = createElement('div', 'iconsWrapper')
    this.newGameButton = createElement(
      'div',
      `firstButton${state.theme}`,
      'Random game',
    )
    this.resetGameButton = createElement(
      'div',
      `secondButton${state.theme}`,
      'Reset',
    )
    this.saveButton = createElement(
      'div',
      `secondButton${state.theme}`,
      'Save game',
    )
    this.loadButton = createElement(
      'div',
      `firstButton${state.theme}`,
      'Load game',
    )
    this.showSolutionButton = createElement(
      'div',
      `firstButton${state.theme}`,
      'Solution',
    )
    this.timerWindow = createElement('div', `timer${state.theme}`, '00:00')
    this.scoresButton = createElement(
      'div',
      `secondButton${state.theme}`,
      'Scores',
    )
    this.scoresButton.classList.add('scoresButton')
    this.muteButton = createElement('div', 'muteButton')
    this.themeButton = createElement('div', `themeButton${state.theme}`)
    this.sizeSelector = createElement('select', `sizeSelector${state.theme}`)
    this.sizeSelector.id = 'sel1'
    ;['easy', 'medium', 'hard'].forEach((option, index) => {
      const optionElement = document.createElement('option')
      optionElement.textContent = option
      optionElement.classList.add(`option${index + 2}${state.theme}`)
      optionElement.value = 5 * (index + 1)

      this.sizeSelector.appendChild(optionElement)
    })

    this.pictureSelector = createElement(
      'select',
      `pictureSelector${state.theme}`,
    )
    this.pictureSelector.addEventListener('change', (event) => {
      const picture = pictures[this.size].find(
        (picture) => picture.name === event.target.value,
      )

      this.picture = picture.value
      this.levelPicture = picture.name
      this.renderBoard()
    })

    pictures[this.size].forEach((option, index) => {
      const optionElement = document.createElement('option')
      optionElement.classList.add(`option${index + 1}${state.theme}`)
      optionElement.textContent = option.name
      optionElement.value = option.name
      this.pictureSelector.appendChild(optionElement)
    })

    this.pictureSelector.value = this.levelPicture
    this.sizeSelector.value = 5
    this.iconsWrapper.append(this.themeButton, this.muteButton)
    this.buttonsWrapper.append(this.newGameButton, this.resetGameButton)
    this.saveButtonsWrapper.append(this.saveButton, this.loadButton)
    this.solutionsButtonsWrapper.append(
      this.showSolutionButton,
      this.scoresButton,
    )
    this.selectsWrapper.append(this.sizeSelector, this.pictureSelector)
    this.buttonContainer.append(
      this.iconsWrapper,
      this.buttonsWrapper,
      this.saveButtonsWrapper,
      this.timerWindow,
      this.solutionsButtonsWrapper,
      this.selectsWrapper,
    )
    this.gameArea.append(this.container, this.buttonContainer)
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
    this.square.style.backgroundImage = `url(${this.levelPicture}.png)`

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
      cellWidth *= 0.83
    }

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

  createPictureSelector = () => {
    this.pictureSelector.innerHTML = ''

    pictures[this.size].forEach((option, index) => {
      const optionElement = document.createElement('option')
      optionElement.classList.add(`option${index}${state.theme}`)
      optionElement.textContent = option.name
      optionElement.value = option.name

      this.pictureSelector.appendChild(optionElement)
    })
  }

  bindSizeSelector(handler) {
    this.sizeSelector.addEventListener('change', (event) => {
      handler(event.target.value)
    })
  }

  bindPictureSelector(handler) {
    this.pictureSelector.addEventListener('change', (event) => {
      handler(event.target.value)
    })
  }

  bindSelectNewPicture(handler) {
    handler()
  }

  bindResetGame(handler) {
    this.resetGameButton.addEventListener('click', () => {
      handler()
    })
  }

  bindShowSolution(handler) {
    this.showSolutionButton.addEventListener('click', () => {
      handler()
    })
  }
  bindSaveGame(handler) {
    this.saveButton.addEventListener('click', () => {
      handler()
    })
  }
  bindLoadGame(handler) {
    this.loadButton.addEventListener('click', () => {
      handler()
    })
  }

  bindScoresButton(handler) {
    this.scoresButton.addEventListener('click', () => {
      handler()
    })
  }

  bindMuteButton(handler) {
    this.muteButton.addEventListener('click', () => {
      handler()
    })
  }

  bindThemeButton(handler) {
    this.themeButton.addEventListener('click', () => {
      handler()
    })
  }
}
