const React = require('react')

const scripts = ['vendor.js', 'index.js']
const Header = require('./components/header')
/* Create a default HTML file to be filled with React   */
/* It is also possible to pre-fill it with our App here, */
/* to benefit from Server Side Rendering                */
const App = () => (
  <html lang="en">
    <Header
      title="Lira"
      scripts={scripts}
    />
    <body>
      <div id="root" />
    </body>
  </html>
)

module.exports = App
