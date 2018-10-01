const React = require('react')

const scripts = ['vendor.js', 'app.js']
const fonts = ['Roboto:300,400,500']
const Header = require('./components/header')
/* Create a default HTML file to be filled with React   */
/* It is also possible to pre-fill it with our App here, */
/* to benefit from Server Side Rendering                */
const App = () => (
  <html lang="en">
    <Header
      title="Jira Text Editor"
      fonts={fonts}
      scripts={scripts}
    />
    <body>
      <div id="root" />
    </body>
  </html>
)

module.exports = App
