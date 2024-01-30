import { state } from '../main'
export function createGrid(game, picture, cellWidth, size) {
  let divider = false
  const arr = []

  picture.forEach((row, i) => {
    row.forEach((cell, j) => {
      const div = document.createElement('div')
      div.id = `${i}-${j}`
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

      game.append(div)
      arr.push(div)

      div.addEventListener('click', () => {
        div.classList.toggle('marked')

        const isBlack = div.classList.contains('marked')

        state.blackCount = isBlack ? state.blackCount + 1 : state.blackCount - 1

        // state.clonedPicture[i][j] = {
        //   ...state.clonedPicture[i][j],
        //   isBlack,
        // }

        if (cell === 1) {
          state.counter = isBlack ? state.counter + 1 : state.counter - 1
        }
      })

      div.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        if (!div.style.backgroundColor) {
          div.innerHTML === 'X' ? (div.innerHTML = '') : (div.innerHTML = 'X')

          if (div.innerHTML === 'X') {
            div.classList.add('crossed')
          } else {
            div.classList.remove('crossed')
          }

          // state.clonedPicture[i][j] = {
          //   ...state.clonedPicture[i][j],
          //   isMarked: div.innerHTML === 'X',
          // }
        }
      })
    })
  })

  return arr
}
