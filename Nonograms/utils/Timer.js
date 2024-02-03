export class Timer {
  constructor(element) {
    this.timer = 0
    this.intervalId = null

    this.element = element
  }

  start() {
    this.intervalId = setInterval(() => {
      this.timer += 1
      this.print()
    }, 1000)
  }

  stop() {
    clearInterval(this.intervalId)
  }

  reset() {
    this.timer = 0
    this.print()
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  saveToLocalStorage(key) {
    localStorage.setItem(`${key}timer`, this.timer)
  }

  getSavedTimer(key) {
    this.timer = +localStorage.getItem(`${key}timer`)
    this.print()
  }

  print() {
    const hours = Math.floor((this.timer / 60) % 60)
    const min = Math.floor(this.timer % 60)
    this.element.textContent = `${hours.toString().padStart(2, 0)}:${min.toString().padStart(2, 0)}`
  }
}
