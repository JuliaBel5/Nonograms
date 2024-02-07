import { Music } from '../utils/Music'
import { createElement } from '../utils/createElement'
import { state } from '../main'
const button = 'button.mp3'
export class LastGames {
  constructor(section) {
    this.list = JSON.parse(localStorage.getItem('lastGames')) ?? []
    this.overlay = null
    this.section = section
    this.isShown = false
    this.audio = new Music()
  }

  create() {
    this.overlay = createElement('div', 'overlay')
    this.overlay.addEventListener('click', () => {})

    this.table = createElement('div', `modal${state.theme}`)
    this.tableContent = createElement('div', 'modal-content')
    this.title = createElement('div', 'title', 'Last 5 Games:')
    this.gameTable = createElement('table', 'table')
    this.tableButton = createElement(
      'button',
      `modal-button${state.theme}`,
      'Return to the game',
    )
    this.tableButton.addEventListener('click', () => {
      this.audio.play(button)
      this.remove()
    })
    this.section.append(this.overlay, this.table)
    this.table.append(this.tableContent)
    this.tableContent.append(this.title, this.gameTable, this.tableButton)
  }

  addItem(item) {
    this.list = JSON.parse(localStorage.getItem('lastGames')) ?? []
    if (this.list.length === 5) {
      this.list.shift()
    }
    this.list.push(item)
    this.save()
  }

  updateTable() {
    this.list.sort((a, b) => a[2] - b[2])
    this.gameTable.innerHTML = ''

    let header = this.gameTable.insertRow(-1)
    let positionHeader = header.insertCell(0)
    let pictureHeader = header.insertCell(1)
    pictureHeader.classList.add('tablePicture')
    let difficultyLevelHeader = header.insertCell(2)
    let timeHeader = header.insertCell(3)
    timeHeader.classList.add('tableTime')
    pictureHeader.innerHTML = 'Picture'
    difficultyLevelHeader.innerHTML = 'Difficulty Level'
    difficultyLevelHeader.classList.add('level')
    positionHeader.textContent = 'Position'
    timeHeader.textContent = 'Time'

    for (let i = 0; i < Math.min(this.list.length, 5); i++) {
      let row = this.gameTable.insertRow(-1)
      let positionCell = row.insertCell(0)
      let pictureCell = row.insertCell(1)
      let difficultyLevelCell = row.insertCell(2)
      let timeCell = row.insertCell(3)
      positionCell.textContent = i + 1
      pictureCell.textContent = this.list[i][0]

      difficultyLevelCell.textContent = `${this.list[i][1]}x${this.list[i][1]}`

      timeCell.textContent = `${this.list[i][3]}`
    }
  }

  save() {
    const listToSave = JSON.stringify(this.list)
    localStorage.setItem('lastGames', listToSave)
  }

  handleEnter = (event) => {
    if (!event.code.endsWith('Enter')) return

    this.remove()
  }

  showTable() {
    this.isShown = true
    this.create()
    this.updateTable()

    document.addEventListener('keydown', this.handleEnter)
  }

  remove() {
    if (this.table) {
      this.isShown = false
      this.table.remove()
      this.overlay.remove()

      document.removeEventListener('keydown', this.handleEnter)
    }
  }
}
