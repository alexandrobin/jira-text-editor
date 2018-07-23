import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import SignUpForm from './SignUpForm'
import Login from './Login'
import JiraFormat from './JiraRenderer'
import Navbar from './Navbar'
import axios from 'axios'
import Profile from './Profile'



class App extends Component {
  state = {
    token: "",
    user : false,
    right:false
  }

  componentWillMount(){
    let self = this
    this.setState({token:window.localStorage.getItem('token')})
    axios.get('/api/auth')
      .then(function(response){
        if (!response.data.success){
          console.log(response.data.message)
        } else {
          self.setState({user:response.data.user})
        }

      })
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  saveNote = (note) => {

  }

  logout = () => {
    this.setState({user:false})
    localStorage.clear()

    window.location.href="/"

  }

  render() {
    return (
      <Router >
      <div className="App">
        <Navbar user={this.state.user} token={this.state.token} logout={this.logout} toggleDrawer={this.toggleDrawer}/>
        {this.state.user ? <Profile right={this.state.right} user={this.state.user} toggleDrawer={this.toggleDrawer}/> : null }
        <Route exact path="/" component={JiraFormat}/>
        <Route path="/register" component={SignUpForm}/>
        <Route path="/login"  component={() =><Login/>}/>
      </div>
    </Router>
    );
  }
}

export default App;
