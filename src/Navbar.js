import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


function Navbar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            <Link to="/" style={{ textDecoration: 'none',color:"white" }}>Jira Text Editor</Link>
          </Typography>
          {!props.token ?(
            <div>
              <Button color="inherit"><Link to="/register" style={{ textDecoration: 'none',color:"white" }}>Beta - Sign Up</Link></Button>
              <Button color="inherit"><Link to="/login" style={{ textDecoration: 'none',color:"white" }}>Beta - Login</Link></Button></div>): null}
            {props.token ?(<Button color="inherit" onClick={props.logout}> Log Out</Button>):null
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
