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
import './App.css';


class App extends Component {
  state = {
    user : undefined
  }


  render() {
    //let user
    // fetch('/', { credentials : 'same-origin' })
    //     .then(function(res){
    //       console.log(res.test)
    //       user=res.currentUser
    //     });
    console.log(this.props.currentUser)
    return (
      <Router>
      <div className="App">
        <Navbar user={this.state.user}/>
        <Route exact path="/" component={JiraFormat}/>
        <Route path="/register" component={SignUpForm}/>
        <Route path="/login"  component={Login}/>
      </div>
    </Router>
    );
  }
}

export default App;
