import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import {inject, observer} from 'mobx-react'
import axios from 'axios'
import FA from 'react-fontawesome'

@inject('note','session')
@observer
class Profile extends React.Component {

  handleNote = (note) => (e) =>{
    e.preventDefault()
      this.props.note.updateNote({value:note.value,title:note.title})
      this.props.session.updateSession({savedNote:note._id})
  }



  render(){
    return(
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
          <Divider/>
          <div className="allnotes">
            {this.props.session.notes.map(note => {
              return (
                <div key={note._id}  onClick={this.handleNote(note)} className="noteblock">
                  <div className="name-note" onClick={this.handleNote(note)}>{note.title}</div>
                  <div onClick={this.props.handleErase(note._id)} className="delete-icon"><FA name="trash">Delete</FA></div>

                </div>
              )
            })}
          </div>

        </SwipeableDrawer>
      </React.Fragment>

    )
  }
}


export default Profile;
