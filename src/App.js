import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {observer, inject} from 'mobx-react';
import SignUpForm from './SignUpForm'
import Login from './Login'
import JiraFormat from './JiraRenderer'
import Navbar from './Navbar'
import axios from 'axios'
import Profile from './Profile'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import swal from 'sweetalert'
require("babel-polyfill");

@inject( ({session,note}) => ({session,note}))
@observer
class NewNote extends React.Component {

  newNote = () => {
    this.props.note.updateNote({value:`New note !`,title:""})
    this.props.session.updateSession({savedNote:false})
  }
  render(){
    return(
      <React.Fragment>
        <Button onClick={this.newNote} variant="fab" color="secondary" aria-label="Edit" className="new-button">
          <Icon>edit_icon</Icon>
        </Button>
      </React.Fragment>
    )
  }

}




@inject( ({session,note}) => ({session,note}))
@observer
class App extends Component {
  state = {
    right:false,
  }

  componentWillMount(){
    let self = this
    axios.get('/api/auth')
      .then(function(response){
        if (!response.data.success){
          console.log(response.data.message)
          localStorage.clear()
        } else {
          self.props.session.updateSession({user:response.data.user})
          if (localStorage.getItem('value') && localStorage.getItem('title')){
            self.props.note.updateNote({value:localStorage.getItem('value'),title:localStorage.getItem('title')})
          }
        }

      })
    axios.get('/api/getUserNotes')
    .then(function(response){
      self.props.session.updateSession({notes:response.data.notes})
    })

  }


  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  save = () => {
    let self = this
    axios.post('/api/saveNote',{
      title:self.props.note.title,
      value:self.props.note.value,
      savedNote:self.props.session.savedNote
    })
    .then(function(response){
      swal({
        title: "Gotcha",
        text: "Note successfully saved !",
        icon: "success",
        button: "Back to Work!"
      })
      console.log(response.data.note)
      self.props.session.updateSession({savedNote:response.data.note})
      localStorage.setItem('value',self.props.note.value)
      localStorage.setItem('title',self.props.note.title)

      axios.get('/api/getUserNotes')
      .then(function(response){
        self.props.session.updateSession({notes:response.data.notes})
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  saveNote = () =>{
    let self = this
    if (self.props.note.title == undefined || self.props.note.title == "") {
      swal("Oups, your note needs a title !", {
            content: "input",
          })
          .then((value) => {
            self.props.note.updateNote({title:value})
          })
          .then(function(){
            self.save()
          });
    } else {
      self.save()
    }
  }

  logout = () => {
    this.props.session.user = false
    localStorage.clear()
    window.location.href="/"

  }

  handleErase = (id) => (e) => {
    e.preventDefault()
    let self = this
    swal("Are you sure ?", "This will be lost forever :'(", "warning")
    .then(function(value){
      if (value){
        axios.get('/api/eraseNote/' + id)
        .then(function(response){
          axios.get('/api/getUserNotes')
          .then(function(response){
            self.props.session.updateSession({notes:response.data.notes})
          })
        })
        .then(function(){
          self.props.note.updateNote({value:"New Note !",title:""})
          self.props.session.updateSession({savedNote:false})
        })
      }
    });
  }



  render() {
    return (
      <Router >
      <div className="App">
        <Navbar toggleDrawer={this.toggleDrawer} saveNote={this.saveNote} logout={this.logout}/>
        {this.props.session.user ? <Profile right={this.state.right} handleErase={this.handleErase}toggleDrawer={this.toggleDrawer}/> : null }
        <Route exact path="/" render={()=><JiraFormat/>}/>
        <Route path="/note/:id" render={JiraFormat}/>
        <Route exact path="/" component={NewNote}/>
        <Route path="/register" component={SignUpForm}/>
        <Route path="/login"  render={() =><Login/>}/>
      </div>
    </Router>
    );
  }
}

export default App;
