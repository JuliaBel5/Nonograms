export class Model {
  constructor() {
    this.key = 0
  }

  createKey(picture) {
    picture.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 1) {
          this.key += 1
        }
      })
    })
  }
}
