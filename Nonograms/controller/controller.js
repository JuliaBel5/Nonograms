import { state } from '../main'
import { Modal } from '../model/modal'
import { level5, level10, level15 } from '../model'

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

    this.view.bindNewGame(() => {
      this.view.bindCheckWin(this.checkKey)
      this.view.picture = this.view.getRandomPicture(
        pictures[this.view.size],
      ).value
      this.view.renderBoard()
      this.view.resizeBoard(state.cellWidth)
      this.modal = new Modal(this.view.gameArea, this.model)
      state.counter = 0
      state.blackCount = 0
      state.isWin = false
    })
  }

  checkKey = () => {
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
    this.view.picture = this.view.getRandomPicture(pictures[value]).value
    this.view.renderBoard()
    this.view.resizeBoard(state.cellWidth)
  }
}
