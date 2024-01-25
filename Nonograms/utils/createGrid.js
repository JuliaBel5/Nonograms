export function createGrid(game, picture, cellWidth, size) {
  let divider = false

  picture.forEach((row, i) => {
    row.forEach((cell, j) => {
      const div = document.createElement('div')
      div.id = `cell-${i}-${j}`
      div.classList.add('cell')
      div.style.width = `${cellWidth}px`
      div.style.height = `${cellWidth}px`

      if ((j + 1) % 5 === 0 && size >= 10 && j + 1 < size) {
        div.style.borderRight = '2px solid blue' // Add border to the right of the div
        divider = true
      } else if (divider) {
        divider = false
      }

      // Add horizontal divider after every 5 rows
      if ((i + 1) % 5 === 0 && size >= 10 && i + 1 < size) {
        div.style.borderBottom = '2px solid blue' // Add border to the bottom of the div
      }

      game.appendChild(div)

      if (cell === 1) {
        div.addEventListener('click', () => {
          div.style.backgroundColor =
            div.style.backgroundColor === 'black' ? 'white' : 'black'
        })
      }
    })
  })
}
