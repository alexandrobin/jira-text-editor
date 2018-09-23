import {
  observable,
  action,
} from 'mobx'

class StateUi {
    @observable right = false

    @observable renderer = true

    @action updateUi = (state) => {
      const values = {
        ...this,
        ...state,
      }
      this.right = values.right
      this.renderer = values.renderer
    }
}

const stateUi = new StateUi()
export default stateUi
