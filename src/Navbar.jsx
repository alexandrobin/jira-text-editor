import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { observer, inject } from 'mobx-react'
import {
  Link,
} from 'react-router-dom'

const styles = {
  root: {
    flexGrow: 1,
  },
  textField: {
    width: 200,
    float: 'center',
    'background-color': '#7986CB',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

@inject('note', 'session')
@observer
class Navbar extends React.Component {
  handleChange = (event) => {
    this.props.note.updateNote({ title: event.target.value })
  };

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton> */}
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
JIRA TEXT EDITOR
              </Link>
            </Typography>
            {!this.props.session.user ? (
              <div>
                <Button color="inherit">
                  <Link to="/register" style={{ textDecoration: 'none', color: 'white' }}>
Sign Up
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
Login
                  </Link>
                </Button>

              </div>) : null}
            {this.props.session.user ? (
              <div>
                <TextField
                  id="name"
                  className={classes.textField}
                  value={this.props.note.title}
                  onChange={this.handleChange}
                  margin="normal"
                  placeholder="Select a name"
                />
                <Button onClick={this.props.saveNote} color="inherit">
                  {this.props.session.savedNote ? 'Update' : 'Save'}
                </Button>
                <Button onClick={this.props.toggleDrawer('right', true)} color="inherit">
                  {this.props.session.user.username}
                </Button>
                <Button color="inherit" onClick={this.props.logout}>
                  {' '}
Log Out
                </Button>
              </div>) : null
          }
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}


export default withStyles(styles)(Navbar)
