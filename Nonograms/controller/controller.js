import { cat, heart } from '../model/5x5'
const { rows: rowClues, cols: colClues } = generateClues(heart)

const container = document.getElementById('nonogram')

// Create the grid
const grid = heart.forEach((row, i) => {
  row.forEach((cell, j) => {
    const div = document.createElement('div')
    div.id = `cell-${i}-${j}`
    div.classList.add('cell')
    // div.style.backgroundColor = cell === 1 ? 'black' : 'white';
    container.appendChild(div)

    // Add event listener here
    if (cell === 1) {
      div.addEventListener('click', () => {
        div.style.backgroundColor =
          div.style.backgroundColor === 'black' ? 'white' : 'black'
      })
    }
  })
})
// Create the clues
rowClues.forEach((clue, i) => {
  const div = document.createElement('div')
  div.textContent = clue.join(', ')
  div.classList.add('clue')
  container.appendChild(div)
})

colClues.forEach((clue, i) => {
  const div = document.createElement('div')
  div.textContent = clue.join(', ')
  div.classList.add('clue')
  container.appendChild(div)
})
