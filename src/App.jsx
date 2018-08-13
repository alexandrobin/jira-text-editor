import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'
import { observer, inject } from 'mobx-react'
import JiraFormat from './JiraRenderer'
import NewNote from './library/newNote'
import Navbar from './Navbar'
import Login from './Login'
import Profile from './Profile'
import EditorContainer from './Editor'
import SignUpForm from './SignUpForm'


@inject(({ session, note }) => ({ session, note }))
@observer
class App extends Component {
  state = {
    right: false,
  }

  componentWillMount() {
    const self = this
    axios.get('/api/auth')
      .then((response) => {
        if (!response.data.success) {
          localStorage.clear()
        } else {
          self.props.session.updateSession({ user: response.data.user })
          if (localStorage.getItem('value') && localStorage.getItem('title')) {
            self.props.note.updateNote({ value: localStorage.getItem('value'), title: localStorage.getItem('title') })
            self.props.session.updateSession({ savedNote: localStorage.getItem('noteid') })
          }
        }
      })
    axios.get('/api/getUserNotes')
      .then((response) => {
        self.props.session.updateSession({ notes: response.data.notes })
      })
  }


  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  };

  save = () => {
    const self = this
    axios.post('/api/saveNote', {
      title: self.props.note.title,
      value: self.props.note.value,
      savedNote: self.props.session.savedNote,
    })
      .then((response) => {
        swal({
          title: 'Gotcha',
          text: 'Note successfully saved !',
          icon: 'success',
          button: 'Back to Work!',
        })
        self.props.session.updateSession({ savedNote: response.data.note })
        localStorage.setItem('value', self.props.note.value)
        localStorage.setItem('title', self.props.note.title)
        localStorage.setItem('noteid', self.props.session.savedNote)

        axios.get('/api/getUserNotes')
          .then((res) => {
            self.props.session.updateSession({ notes: res.data.notes })
          })
      })
      .catch((error) => {
        throw error
      })
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
          <Route path="/v2" render={EditorContainer} />
          <Route exact path="/" component={NewNote} />
          <Route path="/register" component={SignUpForm} />
          <Route path="/login" render={() => <Login />} />
        </div>
      </Router>
    )
  }
}

export default App
