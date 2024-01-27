import { createElement } from '../utils/createElement'

export class Modal {
  constructor(section, model) {
    this.overlay = null
    this.section = section
    this.model = model
    this.modal = null
    this.isShown = false
  }

  handleEnter = (event) => {
    if (!event.code.endsWith('Enter')) return

    this.remove()
  }

  create(title, message) {
    this.overlay = createElement('div', 'overlay')
    this.overlay.addEventListener('click', () => {})
    this.section.append(this.overlay)
    this.modal = createElement('div', 'modal')
    this.modalContent = createElement('div', 'modal-content')
    this.title = createElement('div', 'title', title)
    this.message = createElement('div', 'message', message)
    this.modalButton = createElement(
      'button',
      'modal-button',
      'Return to the game',
    )
    this.modalButton.addEventListener('click', () => {
      this.remove()
      // this.model.resetGame()
    })

    this.modal.append(this.modalContent)
    this.modalContent.append(this.title, this.message, this.modalButton)
    this.section.append(this.modal)
  }

  showModal(title, message) {
    this.isShown = true
    this.create(title, message)
    document.addEventListener('keydown', this.handleEnter)
  }

  remove() {
    if (this.modal) {
      this.isShown = false
      this.modal.remove()
      this.overlay.remove()

      document.removeEventListener('keydown', this.handleEnter)
    }
  }
}
