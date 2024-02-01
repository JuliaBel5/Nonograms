import { state } from '../main'
import { Modal } from '../model/modal'
import { level5, level10, level15 } from '../model'
import { createSolution } from '../utils/createSolution'
import { LocalStorage } from '../Storage/localStorage'

const pictures = {
  5: level5,
  10: level10,
  15: level15,
}

export class Controller {
  constructor(view, model) {
    this.view = view
    this.model = model
    this.localStorage = new LocalStorage()
    this.modal = new Modal(this.view.gameArea, this.model)
    this.model.createKey(this.view.picture)
    this.view.bindCheckWin(this.checkKey)
    this.view.bindSizeSelector(this.changeSize)
    this.view.bindResetGame(this.resetGame)
    this.view.bindShowSolution(this.showSolution)
    this.view.bindSaveGame(this.saveGame)
    this.view.bindLoadGame(this.loadGame)
    this.view.bindPictureSelector(this.stateReset)
    this.view.bindNewGame(() => {
      this.view.size = this.getRandomLevel([5, 10, 15])

      this.view.createPictureSelector()
      this.view.randomChoice = this.view.getRandomPicture(
        pictures[this.view.size],
      )
      this.view.picture = this.view.randomChoice.value
      this.view.sizeSelector.value = this.view.size
      this.view.pictureSelector.value = this.view.randomChoice.name
      this.view.renderBoard()
      this.stateReset()
    })
  }

  checkKey = () => {
    console.log(state.counter, state.blackCount, this.model.key, state.isWin)

    if (
      !state.isWin &&
      state.counter === this.model.key &&
      state.counter === state.blackCount
    ) {
      console.log('you win')
      this.view.bindCheckWin(this.checkKey)
      this.modal.showModal('You win', 'Congrats!')
      state.isWin = true
    }
  }

  changeSize = (value) => {
    console.log(typeof value, Number(value))
    this.view.size = Number(value)
    this.view.cellWidth = state.cellWidth
    this.view.randomChoice = this.view.getRandomPicture(
      pictures[this.view.size],
    )
    this.view.picture = this.view.randomChoice.value

    this.view.renderBoard()
    this.view.createPictureSelector()
    this.view.pictureSelector.value = this.view.randomChoice.name
    this.stateReset()
  }

  stateReset = () => {
    this.view.resizeBoard(state.cellWidth)
    this.modal = new Modal(this.view.gameArea, this.model)
    this.model.key = 0
    this.model.createKey(this.view.picture)
    state.counter = 0
    state.blackCount = 0
    state.isWin = false
    this.view.bindCheckWin(this.checkKey)
  }

  resetGame = () => {
    this.view.renderBoard()
    this.stateReset()
  }

  showSolution = () => {
    console.log(this.view.size === 15)
    this.resetGame()

    this.view.game.innerHTML = ''
    createSolution(
      this.view.game,
      this.view.picture,
      this.view.cellWidth,
      this.view.size,
    )
    this.view.resizeBoard(this.view.cellWidth)
  }

  saveGame = () => {
    const savedGame = Array.from(this.view.game.children)

    this.localStorage.setItem('counter', state.counter)
    this.localStorage.setItem('blackCount', state.blackCount)
    this.localStorage.setItem('isWin', state.isWin)
    this.localStorage.setItem('size', this.view.size)
    const markedCells = savedGame
      .map((cell, index) => {
        return cell.classList.contains('marked') ? `${index}` : null
      })
      .filter(Boolean)
    this.localStorage.setItem('markedCells', markedCells)

    const crossedCells = savedGame
      .map((cell, index) => {
        return cell.classList.contains('crossed') ? `${index}` : null
      })
      .filter(Boolean)
    this.localStorage.setItem('crossedCells', crossedCells)
    this.localStorage.setItem('savedPicture', this.view.picture)
    this.localStorage.setItem(
      'savedPictureName',
      this.view.pictureSelector.value,
    )
  }

  loadGame = () => {
    const savedPicture = this.localStorage.getItem('savedPicture')

    if (savedPicture) {
      this.view.picture = savedPicture
    }

    const savedSize = this.localStorage.getItem('size')
    if (savedSize) {
      this.view.size = savedSize
    }

    this.view.sizeSelector.value = this.view.size
    this.view.createPictureSelector()

    const savedPictureName = this.localStorage.getItem('savedPictureName')
    if (savedPictureName) {
      this.view.pictureSelector.value = savedPictureName
    }
    this.resetGame()
    const savedCounter = this.localStorage.getItem('counter')
    if (savedCounter) {
      state.counter = savedCounter
    }

    const savedBlackCount = this.localStorage.getItem('blackCount')
    if (savedBlackCount) {
      state.blackCount = savedBlackCount
    }

    const savedIsWin = this.localStorage.getItem('isWin')
    if (savedIsWin) {
      state.isWin = savedIsWin
    }
    const savedGame = Array.from(this.view.game.children)

    const savedCrossedCells = this.localStorage.getItem('crossedCells')
    const savedMarkedCells = this.localStorage.getItem('markedCells')
    if (savedMarkedCells) {
      const markedCellIndices = savedMarkedCells
      markedCellIndices.forEach((index) => {
        savedGame[index].classList.add('marked')
        savedGame[index].textContent = 'X'
      })
    }
    if (savedCrossedCells) {
      const crossedCellIndices = savedCrossedCells
      crossedCellIndices.forEach((index) => {
        savedGame[index].classList.add('crossed')
        savedGame[index].textContent = 'X'
      })
    }
  }

  getRandomLevel(levels) {
    const index = Math.floor(Math.random() * levels.length)
    return levels[index]
  }
}
