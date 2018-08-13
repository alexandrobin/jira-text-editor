import React from 'react'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Divider from '@material-ui/core/Divider'
import { inject, observer } from 'mobx-react'
import FA from 'react-fontawesome'

@inject('note', 'session')
@observer
class Profile extends React.Component {
  handleNote = note => (e) => {
    e.preventDefault()
    this.props.note.updateNote({ value: note.value, title: note.title })
    this.props.session.updateSession({ savedNote: note._id })
  }


  render() {
    return (
      <React.Fragment>
        <SwipeableDrawer
          id="RightDrawer"
          anchor="right"
          open={this.props.right}
          onClose={this.props.toggleDrawer('right', false)}
          onOpen={this.props.toggleDrawer('right', true)}
        >
          <div className="header">
            {this.props.session.user.mail}
          </div>
          <Divider />
          <div className="allnotes">
            {this.props.session.notes.map(note => (
              <div role="textbox" key={note._id} onClick={this.handleNote(note)} className="noteblock" tabIndex="0">
                <div className="name-note" onClick={this.handleNote(note)}>
                  {note.title}
                </div>
                <div onClick={this.props.handleErase(note._id)} className="delete-icon">
                  <FA name="trash">
Delete
                  </FA>
                </div>

              </div>
            ))}
          </div>

        </SwipeableDrawer>
      </React.Fragment>

    )
  }
}


export default Profile
