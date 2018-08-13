import React from 'react'
import { observer, inject } from 'mobx-react'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

@inject(({ session, note }) => ({ session, note }))
@observer
export default class NewNote extends React.Component {
    newNote = () => {
      this.props.note.updateNote({ value: 'New note !', title: '' })
      this.props.session.updateSession({ savedNote: false })
    }

    render() {
      return (
        <React.Fragment>
          <Button onClick={this.newNote} variant="fab" color="secondary" aria-label="Edit" className="new-button">
            <Icon>
                edit_icon
            </Icon>
          </Button>
        </React.Fragment>
      )
    }
}
