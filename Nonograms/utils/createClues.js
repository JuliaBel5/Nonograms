import { createElement } from './createElement'
export function createClues(arr) {
  const rows = arr.map((row) => {
    let clues = []
    let count = 0
    for (let cell of row) {
      if (cell === 1) {
        count++
      } else {
        if (count > 0) {
          clues.push(count)
          count = 0
        }
      }
    }
    if (count > 0) {
      clues.push(count)
    }
    return clues
  })

  const cols = arr[0].map((_, index) => {
    let clues = []
    let count = 0
    for (let row of arr) {
      if (row[index] === 1) {
        count++
      } else {
        if (count > 0) {
          clues.push(count)
          count = 0
        }
      }
    }
    if (count > 0) {
      clues.push(count)
    }
    return clues
  })

  const maxRowsLength = Math.max(...rows.map((r) => r.length))
  const maxColsLength = Math.max(...cols.map((c) => c.length))

  if (maxRowsLength > maxColsLength) {
    cols.forEach((col, i) => {
      while (col.length < maxRowsLength) {
        col.unshift(0)
      }
    })
    rows.forEach((row, i) => {
      while (row.length < maxRowsLength) {
        row.unshift(0)
      }
    })
  } else {
    rows.forEach((row, i) => {
      while (row.length < maxColsLength) {
        row.unshift(0)
      }
    })
    cols.forEach((col, i) => {
      while (col.length < maxColsLength) {
        col.unshift(0)
      }
    })
  }

  return { rows, cols }
}

export function createRowClues(clues, cellWidth, coeff, size) {
  let divider = false

  const rowClueContainer = createElement('div', 'row')

  clues.forEach((clue, i) => {
    const filteredClue = clue.filter((element) => element !== 0)
    if (filteredClue.length > 0) {
      const clueDiv = createElement('div', 'rowClue')
      clueDiv.style.height = `${cellWidth * coeff}px`
      clueDiv.style.width = `${cellWidth * coeff}px`
      clueDiv.textContent = filteredClue.join('')

      if ((i + 1) % 5 === 0 && size >= 10 && i + 1 < size) {
        clueDiv.style.borderRight = '2px solid green'
        divider = true
      } else if (divider) {
        divider = false
      }
      rowClueContainer.appendChild(clueDiv)
    }
  })

  return rowClueContainer
}

export function createColumnClues(clues, cellWidth, coeff, size) {
  let divider = false

  const columnClueContainer = createElement('div', 'column')

  clues.forEach((clue, i) => {
    const filteredClue = clue.filter((element) => element !== 0)
    if (filteredClue.length > 0) {
      const clueDiv = createElement('div', 'colClue')
      clueDiv.style.width = `${cellWidth * coeff}px`
      clueDiv.style.height = `${cellWidth * coeff}px`
      clueDiv.textContent = filteredClue.join(' ')

      if ((i + 1) % 5 === 0 && size >= 10 && i + 1 < size) {
        clueDiv.style.borderBottom = '2px solid green'
      }
      columnClueContainer.appendChild(clueDiv)
    }
  })

  return columnClueContainer
}
