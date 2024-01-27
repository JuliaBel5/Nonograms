import { state } from '../main'
import { Modal } from '../model/modal'

export class Controller {
  constructor(view, model) {
    this.view = view
    this.model = model
    this.modal = new Modal(this.view.gameArea, this.model)
    this.model.createKey(this.view.picture)
    this.view.bindCheckWin(this.checkKey)

    this.view.newGameButton.addEventListener('click', () => {
      this.view.renderBoard()
      this.view.bindCheckWin(this.checkKey)
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
}
