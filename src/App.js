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

class NewNote extends React.PureComponent {
  render(){
    return(
      <React.Fragment>
        <Button variant="fab" color="secondary" aria-label="Edit" className="new-button">
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
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  saveNote = () => {
    let self = this
    console.log(this.props.note.title)
    console.log(this.props.note.value)
    if(!this.props.session.note){
      axios.post('/api/saveNote',{
        title:self.props.note.title,
        value:self.props.note.value
      })
      .then(function(response){
        console.log(response.success)
        self.props.session.note = response.success.note
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  logout = () => {
    this.props.session.user = false
    localStorage.clear()
    window.location.href="/"

  }



  render() {
    console.log(this.props.session)
    return (
      <Router >
      <div className="App">
        <Navbar toggleDrawer={this.toggleDrawer} saveNote={this.saveNote}/>
        {this.props.session.user ? <Profile right={this.state.right} user={this.state.user} toggleDrawer={this.toggleDrawer}/> : null }
        <Route exact path="/" render={()=><JiraFormat getValue={this.getValue}/>}/>
        <Route exact path="/" component={NewNote}/>
        <Route path="/register" component={SignUpForm}/>
        <Route path="/login"  render={() =><Login/>}/>
      </div>
    </Router>
    );
  }
}

export default App;
