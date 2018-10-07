import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Query, { QueryBuilder, MutationBuilder } from '@dazzled/framework-query'

import swal from 'sweetalert'
import axios from 'axios'
import { observer, inject } from 'mobx-react'
import JiraFormat from './JiraRenderer'
import NewNote from './library/newNote'
import Navbar from './Navbar'
import Login from './Login'
import Profile from './Profile'
import SignUpForm from './SignUpForm'


@inject(({ session, note }) => ({ session, note }))
@observer
class App extends Component {
  state = {
    right: false,
  }

  componentWillMount() {
    const self = this
    Query({
      auth: {
        select: { user: { _id: true, username: true, mail: true }, success: true, message: true },
      },
    })
      .then(({ auth }) => {
        if (!auth.success) {
          localStorage.clear()
        } else {
          self.props.session.updateSession({ user: auth.user })
          if (localStorage.getItem('value') && localStorage.getItem('title')) {
            self.props.note.updateNote({ value: localStorage.getItem('value'), title: localStorage.getItem('title') })
            self.props.session.updateSession({ savedNote: localStorage.getItem('noteid') })
          }
        }
      })

    Query({
      notes: {
        select: {
          title: true,
          value: true,
          status: true,
          createdBy: { _id: true },
          sharedTo: { _id: true },
          ts: true,
          _id: true,
        },
      },
    })
      .then(({ notes }) => {
        self.props.session.updateSession({ notes })
      })
  }


  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  };

  save = () => {
    const { title, value } = this.props.note
    const id = this.props.session.user._id
    const { savedNote } = this.props.session
    console.log(savedNote)
    if (!savedNote) {
      Query.mutate({
        noteCreate: {
          args: {
            record: {
              title,
              value,
              createdBy: id,
            },
          },
          select: {
            recordId: true,
          },
        },
      })
        .then(({ noteCreate }) => {
          console.log(noteCreate)
          this.props.session.updateSession({ savedNote: noteCreate.recordId })
          localStorage.setItem('value', this.props.note.value)
          localStorage.setItem('title', this.props.note.title)
          localStorage.setItem('noteid', this.props.session.savedNote)
        })
    } else {
      Query.mutate({
        noteUpdate: {
          args: {
            record: {
              _id: savedNote,
              title,
              value,
            },
          },
          select: { recordId: true },
        },
      })
        .then(({ noteUpdate }) => {
          swal({
            title: 'Gotcha',
            text: 'Note successfully saved !',
            icon: 'success',
            button: 'Back to Work!',
          })
          console.log(noteUpdate)
          this.props.session.updateSession({ savedNote: noteUpdate.recordId })
          localStorage.setItem('value', this.props.note.value)
          localStorage.setItem('title', this.props.note.title)
          localStorage.setItem('noteid', this.props.session.savedNote)
          Query({
            notes: {
              select: {
                title: true,
                value: true,
                status: true,
                createdBy: { _id: true },
                sharedTo: { _id: true },
                ts: true,
                _id: true,
              },
            },
          })
            .then(({ notes }) => {
              this.props.session.updateSession({ notes })
            })
        })
    }
    // axios.post('/api/saveNote', {
    //   title: self.props.note.title,
    //   value: self.props.note.value,
    //   savedNote: self.props.session.savedNote,
    // })
    //   .then((response) => {
    //     swal({
    //       title: 'Gotcha',
    //       text: 'Note successfully saved !',
    //       icon: 'success',
    //       button: 'Back to Work!',
    //     })
    //     self.props.session.updateSession({ savedNote: response.data.note })
    //     localStorage.setItem('value', self.props.note.value)
    //     localStorage.setItem('title', self.props.note.title)
    //     localStorage.setItem('noteid', self.props.session.savedNote)

    //     axios.get('/api/getUserNotes')
    //       .then((res) => {
    //         self.props.session.updateSession({ notes: res.data.notes })
    //       })
    //   })
    //   .catch((error) => {
    //     throw error
    //   })
  }

  saveNote = () => {
    const self = this
    if (self.props.note.title === undefined || self.props.note.title === '') {
      swal('Oups, your note needs a title !', {
        content: 'input',
      })
        .then((value) => {
          self.props.note.updateNote({ title: value })
        })
        .then(() => {
          self.save()
        })
    } else {
      self.save()
    }
  }

  logout = () => {
    this.props.session.user = false
    localStorage.clear()
    window.location.href = '/'
  }

  handleErase = id => (e) => {
    e.preventDefault()
    const self = this
    swal('Are you sure ?', "This will be lost forever :'(", 'warning')
      .then((value) => {
        if (value) {
          axios.get(`/api/eraseNote/${id}`)
            .then(() => {
              axios.get('/api/getUserNotes')
                .then((res) => {
                  self.props.session.updateSession({ notes: res.data.notes })
                })
            })
            .then(() => {
              self.props.note.updateNote({ value: 'New Note !', title: '' })
              self.props.session.updateSession({ savedNote: false })
            })
        }
      })
  }


  render() {
    return (
      <Router>
        <div className="App">
          <Navbar toggleDrawer={this.toggleDrawer} saveNote={this.saveNote} logout={this.logout} />
          {this.props.session.user
            ? (
              <Profile
                right={this.state.right}
                handleErase={this.handleErase}
                toggleDrawer={this.toggleDrawer}
              />
            )
            : null }
          <Route exact path="/" render={() => <JiraFormat />} />
          <Route exact path="/" component={NewNote} />
          <Route path="/register" component={SignUpForm} />
          <Route path="/login" render={() => <Login />} />
        </div>
      </Router>
    )
  }
}

export default App
