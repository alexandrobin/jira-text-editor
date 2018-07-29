import { observable, action } from "mobx"

const WelcomeText = `h1. Welcome to Jira Text Editor

Hi! I'm your first file in *JTE*. If you want to play, you can edit me.

h2. H2 Title
h3. H3 Title
h4. H4 Title
h5. H5 Title
h6. H6 Title

* _Bullet points_
* :) Emojis

*Known issues :*
* Bold text with bullet points
* Too much padding between elements`


class StateNote {
  @observable title
  @observable value = WelcomeText
  @action updateNote = (state) => {
    const values = {... this, ...state}
    this.title = values.title
    this.value = values.value
  }
}

const stateNote = new StateNote()
export default stateNote
