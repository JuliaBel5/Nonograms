import { state } from '../main'
import { createElement } from './createElement'

export function createSolution(game, picture, cellWidth, size) {
  let divider = false
  const arr = []

  picture.forEach((row, i) => {
    row.forEach((cell, j) => {
      const div = createElement('div', 'cell')
      if (cell === 1) {
        div.classList.add(`marked${state.theme}`)
      }
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
      if (j === row.length - 1 && i === picture.length - 1) {
        div.style.borderBottomRightRadius = '10px'
      }

      div.addEventListener('contextmenu', (e) => {
        e.preventDefault()
      })
      game.append(div)
      arr.push(div)
    })
  })

  return arr
}
