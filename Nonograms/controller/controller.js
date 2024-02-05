import { state } from '../main'
import { Modal } from '../model/modal'
import { level5, level10, level15 } from '../model'
import { createSolution } from '../utils/createSolution'
import { LocalStorage } from '../Storage/localStorage'
import { Music } from '../utils/Music'
import { LastGames } from '../model/LastGames'
import { Timer } from '../utils/Timer'

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
    this.solutionIsShown = false
    //this.gameIsSaved = localStorage.getItem(`1gameState`) !== 'undefined'
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
    this.view.bindThemeButton(this.themeButton)
    this.view.bindNewGame(this.newGame)
  }

  newGame = () => {
    this.solutionIsShown = false
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
    this.view.pictureSelector.value = this.view.levelPicture
    this.view.renderBoard()
    this.stateReset()
  }

  checkKey = () => {
    if (!this.view.timer.intervalId && !this.solutionIsShown) {
      this.view.timer.start()
    }

    if (
      !state.isWin &&
      state.counter === this.model.key &&
      state.counter === state.blackCount
    ) {
      console.log('you win')
      const gameTime = this.view.timer.timer
      const gameScoresTime = this.view.timerWindow.textContent
      this.result = [
        this.view.levelPicture,
        this.view.size,
        gameTime,
        gameScoresTime,
      ]

      this.table.addItem(this.result)
      this.audio.play(win)
      this.view.timer.stop()
      this.view.bindCheckWin(this.checkKey)
      this.modal.showModal(
        'Great!',
        `You have solved the nonogram
         in ${gameTime} seconds`,
      )
      state.isWin = true
      this.view.timer.saveToLocalStorage(3)
      this.showSolution()
      this.view.timer.getSavedTimer(3)
    }
  }

  changeSize = (value) => {
    this.solutionIsShown = false
    this.audio.play(size)
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
    this.view.resizeBoard(state.cellWidth)
  }

  changePicture = () => {
    this.solutionIsShown = false
    this.audio.play(picture)
    this.view.square.style.backgroundImage = `url(${this.view.levelPicture}.png)`

    this.stateReset()
    this.view.resizeBoard(state.cellWidth)
  }

  stateReset = () => {
    this.isSolutionShown = false
    this.view.saveButton.classList.remove('disabled')
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
    this.solutionIsShown = false
    this.audio.play(reset)
    this.view.renderBoard()
    this.stateReset()
    this.view.pictureSelectorValue = this.view.levelPicture
    this.view.sizeSelector.value = this.view.size
  }

  showSolution = () => {
    //  this.audio.play(solution)
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
    this.solutionIsShown = true
    this.view.saveButton.classList.add('disabled')
  }

  saveGame = (key) => {
    if (this.solutionIsShown) {
      return
    }
    /* if (key === 1) {
      // this.gameIsSaved = true
      this.audio.play(save)
    }*/
    const savedGame = Array.from(this.view.game.children)
    /*   this.localStorage.setItem(`${key}isMuted`, Music.isMuted)
    this.localStorage.setItem(`${key}counter`, state.counter)
    this.localStorage.setItem(`${key}blackCount`, state.blackCount)
    this.localStorage.setItem(`${key}isWin`, state.isWin)
    this.localStorage.setItem(`${key}size`, this.view.size)*/

    this.view.timer.saveToLocalStorage(key)
    const markedCells = savedGame
      .map((cell, index) => {
        return cell.classList.contains(`marked${state.theme}`)
          ? `${index}`
          : null
      })
      .filter(Boolean)
    //   this.localStorage.setItem(`${key}markedCells`, markedCells)

    const crossedCells = savedGame
      .map((cell, index) => {
        return cell.classList.contains(`crossed${state.theme}`)
          ? `${index}`
          : null
      })
      .filter(Boolean)
    /*  this.localStorage.setItem(`${key}crossedCells`, crossedCells)
    this.localStorage.setItem(`${key}savedPicture`, this.view.picture)
    this.localStorage.setItem(
      `${key}savedPictureName`,
      this.view.pictureSelector.value,
    )*/
    if (this.view.loadButton.classList.contains('disabled')) {
      this.view.loadButton.classList.remove('disabled')
    }

    const gameState = {
      isMuted: Music.isMuted,
      counter: state.counter,
      blackCount: state.blackCount,
      isWin: state.isWin,
      size: this.view.size,
      timer: this.view.timer.timer,
      picture: this.view.picture,
      pictureName: this.view.pictureSelector.value,
      markedCells,
      crossedCells,
    }

    const savedGameState = JSON.stringify(gameState)
    this.localStorage.setItem(`${key}gameState`, savedGameState)
  }

  loadGame = (key) => {
    /*  if (!this.gameIsSaved && key === 1) {
      this.modal.showModal('Sorry,', `You should first save a game`)
      this.modal = new Modal(this.view.gameArea, this.model)
      return
    }*/
    this.solutionIsShown = false

    /*if (key === 1) {
      this.audio.play(load)
    }*/
    const savedGameState = this.localStorage.getItem(`${key}gameState`)
    if (savedGameState) {
      const gameState = JSON.parse(savedGameState)

      this.view.size = gameState.size //
      this.view.picture = gameState.picture //

      this.view.sizeSelector.value = this.view.size
      this.view.createPictureSelector()
      this.view.pictureSelector.value = gameState.pictureName
      this.view.levelPicture = gameState.pictureName
      this.view.square.style.backgroundImage = `url(${this.view.levelPicture}.png)`
      this.view.renderBoard()
      this.stateReset()
      state.isWin = gameState.isWin
      state.counter = gameState.counter
      state.blackCount = gameState.blackCount

      if (key === 2) {
        //const isMuted = this.localStorage.getItem(`${key}isMuted`)
        const isMuted = gameState.isMuted
        if (isMuted) {
          Music.isMuted = isMuted
          if (Music.isMuted) {
            this.view.muteButton.classList.add('active')
          }
        }
      }
      /* const savedPicture = this.localStorage.getItem(`${key}savedPicture`)
    if (savedPicture) {
      this.view.picture = savedPicture
    }

    const savedSize = this.localStorage.getItem(`${key}size`)
    if (savedSize) {
      this.view.size = savedSize
    }

    this.view.sizeSelector.value = this.view.size
    this.view.createPictureSelector()

    const savedPictureName = this.localStorage.getItem(`${key}savedPictureName`)
    if (savedPictureName) {
      this.view.pictureSelector.value = savedPictureName
      this.view.levelPicture = savedPictureName
    }*/
      /* this.view.square.style.backgroundImage = `url(${this.view.levelPicture}.png)`
      this.view.renderBoard()
      this.stateReset()*/
      /*  const savedCounter = this.localStorage.getItem(`${key}counter`)
    if (savedCounter) {
      state.counter = savedCounter
    }

    const savedBlackCount = this.localStorage.getItem(`${key}blackCount`)
    if (savedBlackCount) {
      state.blackCount = savedBlackCount
    }

    const savedIsWin = this.localStorage.getItem(`${key}isWin`)
    if (savedIsWin) {
      state.isWin = savedIsWin
    }*/
      const savedGame = Array.from(this.view.game.children)

      // const savedCrossedCells = this.localStorage.getItem(`${key}crossedCells`)
      //   const savedMarkedCells = this.localStorage.getItem(`${key}markedCells`)
      const savedCrossedCells = gameState.crossedCells
      const savedMarkedCells = gameState.markedCells
      //   if (savedMarkedCells) {
      const markedCellIndices = savedMarkedCells
      markedCellIndices.forEach((index) => {
        savedGame[index].classList.add(`marked${state.theme}`)
        savedGame[index].textContent = ''
      })
      //   }
      //   if (savedCrossedCells) {
      const crossedCellIndices = savedCrossedCells
      crossedCellIndices.forEach((index) => {
        savedGame[index].classList.add(`crossed${state.theme}`)
        savedGame[index].textContent = 'X'
      })
      //   }

      this.view.timer.reset()
      this.view.timer.getSavedTimer(key)
    }
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
    this.audio.play(button)
    this.audio.toggleMute()
    this.view.muteButton.classList.toggle('active')
  }

  themeButton = () => {
    const gameIsActive = this.view.timer.intervalId !== null

    this.audio.play(button)
    this.saveGame(2)
    if (!state.theme) {
      state.theme = 1
    } else {
      state.theme = 0
    }
    document.body.innerHTML = ''
    this.stateReset()
    this.view.init()
    document.body.classList.toggle('active')
    this.table = new LastGames(this.view.gameArea) // это таблица рекордов
    this.modal = new Modal(this.view.gameArea, this.model)
    this.view.timer = new Timer(this.view.timerWindow)
    this.view.bindCheckWin(this.checkKey)
    this.view.bindSizeSelector(this.changeSize)
    this.view.bindResetGame(this.resetGame)
    this.view.bindShowSolution(this.showSolution)
    this.view.bindSaveGame(this.saveGame)
    this.view.bindLoadGame(this.loadGame)
    this.view.bindPictureSelector(this.changePicture)
    this.view.bindScoresButton(this.scoresTable)
    this.view.bindMuteButton(this.muteButton)
    this.view.bindThemeButton(this.themeButton)
    this.view.bindNewGame(this.newGame)
    this.loadGame(2)
    if (gameIsActive || state.blackCount > 0) {
      this.view.timer.start()
    }
  }
}
