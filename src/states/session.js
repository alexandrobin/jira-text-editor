import { observable, action } from "mobx"

class StateSession {
  @observable user = false
  @observable username
  @observable notes

  @action updateSession = (state) => {
    const values = {... this, ...state}
    this.user = values.user
    this.username = values.username
    this.note = values.note
  }
}

const stateSession = new StateSession()
export default stateSession
