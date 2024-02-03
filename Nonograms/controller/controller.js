import { state } from '../main'
import { Modal } from '../model/modal'
import { level5, level10, level15 } from '../model'
import { createSolution } from '../utils/createSolution'
import { LocalStorage } from '../Storage/localStorage'
import { Music } from '../utils/Music'
import { LastGames } from '../model/LastGames'

const pictures = {
  5: level5,
  10: level10,
  15: level15,
}
const win = 'win.wav'
const save = 'save.wav'
const load = 'load.mp3'
const solution = 'solution.wav'
const size = 'size.wav'
const picture = 'picture.wav'
const reset = 'reset.wav'
const random = 'random.wav'
const scores = 'tada.mp3' //'scores.wav'
const button = 'button.mp3'

export class Controller {
  constructor(view, model) {
    this.view = view
    this.model = model
    this.localStorage = new LocalStorage()
    this.modal = new Modal(this.view.gameArea, this.model)
    this.audio = new Music()
    this.isMuted = false
    this.table = new LastGames(this.view.gameArea)
    this.model.createKey(this.view.picture)
    this.view.bindCheckWin(this.checkKey)
    this.view.bindSizeSelector(this.changeSize)
    this.view.bindResetGame(this.resetGame)
    this.view.bindShowSolution(this.showSolution)
    this.view.bindSaveGame(this.saveGame)
    this.view.bindLoadGame(this.loadGame)
    this.view.bindPictureSelector(this.changePicture)
    this.view.bindScoresButton(this.scoresTable)
    this.view.bindMuteButton(this.muteButton)
    this.view.bindNewGame(() => {
      this.audio.play(random)
      this.view.size = this.getRandomLevel([5, 10, 15])

      this.view.createPictureSelector()
      this.view.randomChoice = this.view.getRandomPicture(
        pictures[this.view.size],
      )
      this.view.picture = this.view.randomChoice.value
      this.view.levelPicture = this.view.randomChoice.name
      this.view.square.style.backgroundImage = `url(${this.view.levelPicture}.png)`
      this.view.sizeSelector.value = this.view.size
      this.view.pictureSelector.value = this.view.randomChoice.name
      this.view.renderBoard()
      this.stateReset()
    })
  }

  checkKey = () => {
    if (!this.view.timer.intervalId) {
      this.view.timer.start()
    }

    if (
      !state.isWin &&
      state.counter === this.model.key &&
      state.counter === state.blackCount
    ) {
      console.log('you win')
      const gameTime = this.view.timerWindow.textContent
      this.result = [this.view.levelPicture, this.view.size, gameTime]

      this.table.addItem(this.result)
      this.audio.play(win)
      this.view.timer.stop()
      this.view.bindCheckWin(this.checkKey)
      this.modal.showModal('Congrats!', `You won in ${gameTime}`)
      state.isWin = true
    }
  }

  changeSize = (value) => {
    this.audio.play(size)
    console.log(typeof value, Number(value))

    this.view.size = Number(value)
    this.view.cellWidth = state.cellWidth
    this.view.randomChoice = this.view.getRandomPicture(
      pictures[this.view.size],
    )
    this.view.picture = this.view.randomChoice.value
    this.view.levelPicture = this.view.randomChoice.name
    this.view.square.style.backgroundImage = `url(${this.view.levelPicture}.png)`
    this.view.renderBoard()
    this.view.createPictureSelector()
    this.view.pictureSelector.value = this.view.randomChoice.name
    this.stateReset()
  }

  changePicture = () => {
    this.audio.play(picture)
    this.view.square.style.backgroundImage = `url(${this.view.levelPicture}.png)`

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
    this.view.timer.reset()
  }

  resetGame = () => {
    this.audio.play(reset)
    this.view.renderBoard()
    this.stateReset()
  }

  showSolution = () => {
    this.audio.play(solution)
    console.log(this.view.size === 15)
    this.view.renderBoard()
    this.stateReset()

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
    this.audio.play(save)
    const savedGame = Array.from(this.view.game.children)

    this.localStorage.setItem('counter', state.counter)
    this.localStorage.setItem('blackCount', state.blackCount)
    this.localStorage.setItem('isWin', state.isWin)
    this.localStorage.setItem('size', this.view.size)
    this.view.timer.stop()
    this.view.timer.saveToLocalStorage()
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
    this.audio.play(load)
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
    this.view.renderBoard()
    this.stateReset()
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
    this.view.timer.reset()
    this.view.timer.getSavedTimer()
  }

  getRandomLevel(levels) {
    const index = Math.floor(Math.random() * levels.length)
    return levels[index]
  }

  scoresTable = () => {
    this.audio.play(scores)
    this.table.showTable()
  }

  muteButton = () => {
    this.audio.toggleMute()
    this.view.muteButton.classList.toggle('active')
  }
}
