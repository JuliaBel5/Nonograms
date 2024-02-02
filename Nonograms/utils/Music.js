export class Music {
  constructor() {
    this.audio = new Audio()
  }

  play(soundFile) {
    this.reset()
    this.audio.src = soundFile
    this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  stop() {
    this.audio.pause()
    this.audio.currentTime = 0
  }

  reset() {
    this.audio.currentTime = 0
  }

  mute() {
    this.audio.mute()
  }
}
