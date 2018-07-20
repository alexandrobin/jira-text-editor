import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import axios from 'axios'

const styles = theme => ({
  root: {
    width:'40%',
    margin:'0 auto',
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
});

const ranges = [
  {
    value: '0-20',
    label: '0 to 20',
  },
  {
    value: '21-50',
    label: '21 to 50',
  },
  {
    value: '51-100',
    label: '51 to 100',
  },
];

class SignUpForm extends React.Component {
  state = {
    name:'',
    mail:'',
    password: '',
    showPassword: false,
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  register = (name, mail, password) => event => {
    event.preventDefault()
    axios.post('/api/register', {
    name: name,
    password: password,
    mail:mail
  })
  .then(function (response) {
    console.log(response)
    if (response.data.success){
      let token = response.data.token
      window.localStorage.setItem('token', token);
      window.location.href='/'
    } else {
      window.location.href='/register'
    };
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h1>Sign Up !</h1>
        <form onSubmit={this.register(this.state.name,this.state.mail, this.state.password)}>
        <FormControl  fullWidth className={classes.margin}>
          <InputLabel htmlFor="adornment-username">Username</InputLabel>
          <Input
            id="adornment-username"
            value={this.state.amount}
            onChange={this.handleChange('name')}
            name="username"
          />
          <Input
            id="adornment-mail"
            value={this.state.amount}
            onChange={this.handleChange('mail')}
            name="email"
            placeholder="email"
          />
          <Input
            id="adornment-password"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onChange={this.handleChange('password')}
            name="password"
            placeholder="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button type="submit" color="inherit">Submit</Button>
      </form>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpForm);
