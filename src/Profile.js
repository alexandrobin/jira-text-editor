import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import {inject, observer} from 'mobx-react'

@inject('note','session')
@observer
class Profile extends React.Component {
  render(){
    return(
      <React.Fragment>
        <SwipeableDrawer
          id="RightDrawer"
          anchor="right"
          open={this.props.right}
          onClose={this.props.toggleDrawer('right', false)}
          onOpen={this.props.toggleDrawer('right', true)}
        >
          <div className="header">
            My Account
          </div>

        </SwipeableDrawer>
      </React.Fragment>

    )
  }
}


export default Profile;
