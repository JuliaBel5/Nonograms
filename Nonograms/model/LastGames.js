import { createElement } from '../utils/createElement'

export class LastGames {
  constructor(section) {
    this.list = JSON.parse(localStorage.getItem('lastGames')) ?? []
    this.overlay = null
    this.section = section
    this.isShown = false
  }

  create() {
    this.overlay = createElement('div', 'overlay')
    this.overlay.addEventListener('click', () => {})
    this.section.append(this.overlay)
    this.table = createElement('div', 'modal')
    this.tableContent = createElement('div', 'modal-content')
    this.title = createElement('div', 'title', 'Last 5 Games:')
    this.gameTable = createElement('table', 'table')
    this.tableButton = createElement(
      'button',
      'modal-button',
      'Return to the game',
    )
    this.tableButton.addEventListener('click', () => {
      this.remove()
    })

    this.table.append(this.tableContent)
    this.tableContent.append(this.title, this.gameTable, this.tableButton)
    this.section.append(this.table)
  }

  addItem(item) {
    console.log('item', item, 'list1', this.list)
    this.list.push(item)
    if (this.list.length === 5) {
      this.list.shift()
    }
    console.log('list2', this.list)
    this.list.sort((a, b) => a[2] - b[2])
    console.log('list3', this.list)
    this.save()
  }

  updateTable() {
    console.log('list', this.list)
    this.gameTable.innerHTML = ''

    // Create header row
    let header = this.gameTable.insertRow(-1)
    let pictureHeader = header.insertCell(0)
    let difficultyLevelHeader = header.insertCell(1)
    let timeHeader = header.insertCell(2)
    pictureHeader.innerHTML = 'Picture'
    difficultyLevelHeader.innerHTML = 'Difficulty Level'
    timeHeader.innerHTML = 'Time'

    // Add data rows
    for (let i = 0; i < Math.min(this.list.length, 5); i++) {
      let row = this.gameTable.insertRow(-1)
      let pictureCell = row.insertCell(0)
      let difficultyLevelCell = row.insertCell(1)
      let timeCell = row.insertCell(2)

      pictureCell.textContent = this.list[i][0]

      difficultyLevelCell.textContent = `${this.list[i][1]}x${this.list[i][1]}`

      timeCell.textContent = this.list[i][2]
    }

    this.tableContent.append(this.gameTable)
    console.log(this.gameTable)
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
