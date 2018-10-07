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
import { observer, inject } from 'mobx-react'
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


@inject(({ session }) => ({ session }))
@observer
class Login extends React.Component {
  state = {
    name: '',
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

  authenticate = (mail, password) => (event) => {
    event.preventDefault()

    const hPwd = sha1(password)
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

  render() {
    const { classes } = this.props

    return (
      <div id="login-page">
        <h3>
          {' '}
Login
        </h3>
        <form onSubmit={this.authenticate(this.state.name, this.state.password)}>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="adornment-email">
Username
            </InputLabel>
            <Input
              id="adornment-email"
              value={this.state.amount}
              onChange={this.handleChange('name')}
              name="mail"
            />
            <Input
              id="adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.handleChange('password')}
              name="password"
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

export default withStyles(styles)(Login)
