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
        } else {
          self.props.session.updateSession({user:response.data.user})
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

  saveNote = () => {
    let self = this
    console.log(this.props.session.savedNote)
      axios.post('/api/saveNote',{
        title:self.props.note.title,
        value:self.props.note.value,
        savedNote:self.props.session.savedNote
      })
      .then(function(response){
        self.props.session.updateSession({savedNote:response.data.note})
        axios.get('/api/getUserNotes')
        .then(function(response){
          self.props.session.updateSession({notes:response.data.notes})
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  logout = () => {
    this.props.session.user = false
    localStorage.clear()
    window.location.href="/"

  }



  render() {
    return (
      <Router >
      <div className="App">
        <Navbar toggleDrawer={this.toggleDrawer} saveNote={this.saveNote} logout={this.logout}/>
        {this.props.session.user ? <Profile right={this.state.right} user={this.state.user} toggleDrawer={this.toggleDrawer}/> : null }
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
