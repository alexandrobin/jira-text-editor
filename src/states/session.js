import { observable, action } from 'mobx'

class StateSession {
  @observable user = false

  @observable username

  @observable notes = []

  @observable savedNote

  @action updateSession = (state) => {
    const values = { ...this, ...state }
    this.user = values.user
    this.username = values.username
    this.notes = values.notes
    this.savedNote = values.savedNote
  }
}

const stateSession = new StateSession()
export default stateSession
