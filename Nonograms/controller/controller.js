import { state } from '../main'
import { Modal } from '../model/modal'
import { level5, level10, level15 } from '../model'
import { createSolution } from '../utils/createSolution'

const pictures = {
  5: level5,
  10: level10,
  15: level15,
}

export class Controller {
  constructor(view, model) {
    this.view = view
    this.model = model
    this.modal = new Modal(this.view.gameArea, this.model)
    this.model.createKey(this.view.picture)
    this.view.bindCheckWin(this.checkKey)
    this.view.bindSizeSelector(this.changeSize)
    this.view.bindResetGame(this.resetGame)
    this.view.bindShowSolution(this.showSolution)
    this.view.bindSaveGame(this.saveGame)
    this.view.bindLoadGame(this.loadGame)

    this.view.bindNewGame(() => {
      const picture = this.view.getRandomPicture(pictures[this.view.size])
      this.view.picture = picture.value
      this.resetGame()
      this.modal = new Modal(this.view.gameArea, this.model)
      this.model.key = 0
      this.model.createKey(this.view.picture)
      state.counter = 0
      state.blackCount = 0
      state.isWin = false
      this.view.pictureSelector.value = picture.name
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
    this.view.size = Number(value)
    this.view.cellWidth = state.cellWidth
    this.view.randomChoice = this.view.getRandomPicture(pictures[value])
    this.view.picture = this.view.randomChoice.value
    this.view.renderBoard()
    this.view.resizeBoard(state.cellWidth)
    this.view.createPictureSelector()
    this.view.pictureSelector.value = this.view.randomChoice.name
  }

  resetGame = () => {
    this.view.renderBoard()
    this.view.resizeBoard(state.cellWidth)
    this.view.bindCheckWin(this.checkKey)
  }

  showSolution = () => {
    this.resetGame()
    this.view.game.innerHTML = ''
    createSolution(
      this.view.game,
      this.view.picture,
      state.cellWidth,
      state.size,
    )
  }

  saveGame = () => {
    const savedGame = Array.from(this.view.game.children)

    const savedCounter = state.counter
    localStorage.setItem('counter', JSON.stringify(savedCounter))
    const savedBlackCount = state.blackCount
    localStorage.setItem('blackCount', JSON.stringify(savedBlackCount))
    const savedIsWin = state.isWin
    localStorage.setItem('isWin', JSON.stringify(savedIsWin))
    const savedSize = this.view.size
    localStorage.setItem('size', JSON.stringify(savedSize))
    const markedCells = savedGame
      .map((cell, index) => {
        return cell.classList.contains('marked') ? `${index}` : null
      })
      .filter(Boolean)
    localStorage.setItem('markedCells', JSON.stringify(markedCells))

    const crossedCells = savedGame
      .map((cell, index) => {
        return cell.classList.contains('crossed') ? `${index}` : null
      })
      .filter(Boolean)
    localStorage.setItem('crossedCells', JSON.stringify(crossedCells))

    const savedPicture = this.view.picture

    localStorage.setItem('savedPicture', JSON.stringify(savedPicture))

    const savedPictureName = this.view.pictureSelector.value
    localStorage.setItem('savedPictureName', JSON.stringify(savedPictureName))
  }

  loadGame = () => {
    const savedPicture = localStorage.getItem('savedPicture')

    if (savedPicture) {
      this.view.picture = JSON.parse(savedPicture)
    }

    this.model.key = 0
    this.model.createKey(this.view.picture)

    this.modal = new Modal(this.view.gameArea, this.model)
    const savedCounter = localStorage.getItem('counter')
    if (savedCounter) {
      state.counter = JSON.parse(savedCounter)
    }

    const savedBlackCount = localStorage.getItem('blackCount')
    if (savedBlackCount) {
      state.blackCount = JSON.parse(savedBlackCount)
    }

    const savedIsWin = localStorage.getItem('isWin')
    if (savedIsWin) {
      state.isWin = JSON.parse(savedIsWin)
    }
    const savedSize = localStorage.getItem('size')
    if (savedSize) {
      this.view.size = JSON.parse(savedSize)
    }
    this.view.sizeSelector.value = this.view.size

    this.view.createPictureSelector()

    const savedPictureName = localStorage.getItem('savedPictureName')
    if (savedPictureName) {
      this.view.pictureSelector.value = JSON.parse(savedPictureName)
    }
    this.resetGame()
    const savedGame = Array.from(this.view.game.children)

    const savedCrossedCells = localStorage.getItem('crossedCells')
    const savedMarkedCells = localStorage.getItem('markedCells')
    if (savedMarkedCells) {
      const markedCellIndices = JSON.parse(savedMarkedCells)
      markedCellIndices.forEach((index) => {
        savedGame[index].classList.add('marked')
        savedGame[index].textContent = 'X'
      })
    }
    if (savedCrossedCells) {
      const crossedCellIndices = JSON.parse(savedCrossedCells)
      crossedCellIndices.forEach((index) => {
        savedGame[index].classList.add('crossed')
        savedGame[index].textContent = 'X'
      })
    }
  }
}
