import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import Query, { QueryBuilder, MutationBuilder } from '@dazzled/framework-query'
import sha1 from 'sha1'

const styles = theme => ({
  root: {
    width: '40%',
    margin: '0 auto',
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
})


class SignUpForm extends React.Component {
  state = {
    name: '',
    mail: '',
    password: '',
    showPassword: false,
  };

  handleChange = prop => (event) => {
    this.setState({ [prop]: event.target.value })
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault()
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }))
  };

  register = (username, mail, password) => (event) => {
    event.preventDefault()

    const hPwd = sha1(password)
    Query.mutate({
      register: {
        args: { username, mail, password: hPwd },
      },
    })
      .then(({ register }) => {
        if (register) {
          Query({
            connect: {
              args: { mail, password: hPwd },
              select: { token: true, error: true },
            },
          }).then(({ connect }) => {
            if (connect.token) {
              window.localStorage.setItem('token', connect.token)
              window.location.href = '/'
            } else {
              console.error(connect.error)
            }
          })
        }
      })
  }

  render() {
    const { classes } = this.props

    return (
      <div id="login-page">
        <h3>
Sign Up !
        </h3>
        <form onSubmit={this.register(this.state.name, this.state.mail, this.state.password)}>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="adornment-username">
Username
            </InputLabel>
            <Input
              id="adornment-username"
              value={this.state.amount}
              onChange={this.handleChange('name')}
              name="username"
              required
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="adornment-mail">
Email
            </InputLabel>
            <Input
              id="adornment-mail"
              value={this.state.amount}
              onChange={this.handleChange('mail')}
              name="email"
              placeholder="email"
              required
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="adornment-password">
Password
            </InputLabel>
            <Input
              id="adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.handleChange('password')}
              name="password"
              placeholder="Password"
              required
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
)}
            />
          </FormControl>
          <Button type="submit" color="inherit">
Submit
          </Button>
        </form>
      </div>
    )
  }
}


export default withStyles(styles)(SignUpForm)
