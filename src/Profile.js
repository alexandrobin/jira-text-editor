import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Login from './Login'


const styles = {
  header:{
    'line-height':'4rem',
    'font-size':'1.5rem',
    'text-align':'center',
    'letter-spacing':0.5
  },
  titleAside:{
    'line-height':'0.8rem',
    'text-align':'start',
    'letter-spacing':'normal',
    'font-size':'0.8rem',
    'color':'#96a0b4'
  },
  user:{
    'padding':10,
    'text-align':'center',
    width:380
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 400,
  },
};


function Profile(props) {
  const { classes } = props;
  const header = (
    <div className={classes.header}>
      MY ACCOUNT
    </div>
  )

  const user = (
    <div className= {classes.user}>
      <h2 className={classes.titleAside}>Hi, {props.user.username}</h2>
    </div>
  )
  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={props.right}
        onClose={props.toggleDrawer('right', false)}
        onOpen={props.toggleDrawer('right', true)}
      >
        {header}
        <Divider/>
        {user}
      </SwipeableDrawer>
    </div>
  );
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
