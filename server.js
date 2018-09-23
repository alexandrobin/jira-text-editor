const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const sha1 = require('sha1')
const Note = require('./src/models/notes')
const User = require('./src/models/users')


// ------
// CONFIG
// ------

mongoose.connect('mongodb://127.0.0.1:27017/jira-text-editor', { useNewUrlParser: true })
  .catch((err) => {
    throw err
  })


const app = express()
app.use(morgan('dev'))

app.set('superSecret', "hello it's me again")

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.test = 1234
  next()
})


//= =======
// ROUTES
// =======
app.get('/setup', (req, res) => {
  const pass = sha1('password')
  // create a sample user
  const nick = new User({
    username: 'username1',
    mail: 'testmail@mail.com',
    admin: true,
  })

  const pwd = sha1(pass + nick._id)
  nick.password = pwd
  // save the sample user
  nick.save((err) => {
    if (err) {
      res.json({ success: false, err })
    } else {
      console.log('User saved successfully')
      res.json({ success: true, user: nick })
    }
  })
})


const staticPath = path.join(__dirname, './public')
app.use(express.static(staticPath))
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})
app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})
app.get('/register', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})

app.get('/note/:id', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})


// API ROUTES -------------------

// get an instance of the router for api routes
const apiRoutes = express.Router()

// route to authenticate a user (POST http://localhost:8080/api/authenticate)

apiRoutes.post('/login', (req, res) => {
  // find the user
  User.findOne({
    $or: [
      { username: req.body.name },
      { mail: req.body.name },
    ],
  }, (err, user) => {
    if (err) throw err

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' })
    } else if (user) {
      const hashedPassword = sha1(req.body.password)
      const pwd = sha1(hashedPassword + user._id)
      // check if password matches
      if (user.password !== pwd) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' })
      } else {
        // if user is found and password is right
        // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
        const payload = {
          id: user._id,
          admin: user.admin,
        }
        const token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: '7d', // expires in 24 hours
        })

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token,
        })
      }
    }
  })
})

apiRoutes.post('/register', (req, res) => {
  const hashedPassword = sha1(req.body.password)

  const newUser = new User({ username: req.body.name, mail: req.body.mail })
  const pwd = sha1(hashedPassword + newUser._id)
  newUser.password = pwd
  newUser.save((err) => {
    if (err) throw err
    const payload = {
      id: newUser._id,
      admin: newUser.admin,
    }

    const token = jwt.sign(payload, app.get('superSecret'), { expiresIn: '7d' })

    // return the information including token as JSON
    res.json({
      success: true,
      message: 'Enjoy your token!',
      token,
    })
  })
})

apiRoutes.get('/auth', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        })
      }
      User.findOne({ _id: decoded.id }, (err1, user) => {
        if (!err1) {
          res.json({
            success: true,
            user,
          })
        }
      })
    })
  }
})


apiRoutes.post('/saveNote', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const { title, value } = req.body

  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        })
      }
      if (!req.body.savedNote) {
        const note = new Note({ title, value, createdBy: decoded.id })
        note.save((err1) => {
          if (err1) throw err1
          res.json({
            success: true,
            note: note._id,
            message: 'Note successfully saved !',
          })
        })
      } else {
        const id = req.body.savedNote
        const updatedNote = { $set: { value: req.body.value, title: req.body.title } }
        Note.findByIdAndUpdate(id, updatedNote, { new: true }, (err2, updated) => {
          if (err2) throw err2
          res.json({
            success: true,
            note: updated,
          })
        })
      }
    })
  }
})

apiRoutes.get('/getUserNotes', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: err,
        })
      }
      Note.find({ createdBy: decoded.id })
        .exec((err1, result) => {
          if (!err1) {
            res.json({
              notes: result,
            })
          }
        })
    })
  }
})

apiRoutes.get('/note/:id', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        })
      }
      User.findOne({ _id: decoded.id }, (err1, user) => {
        if (err1) throw err1
        const note = user.notes.filter(_note => _note._id === req.params.id)
        res.json({
          success: true,
          note: note[0],
        })
      })
    })
  }
})

apiRoutes.get('/eraseNote/:id', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (token) {
    jwt.verify(token, app.get('superSecret'), (err) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        })
      }
      Note.findByIdAndDelete(req.params.id, (err1) => {
        if (err1) throw err1
        res.json({
          success: true,
          message: 'Note has been erased with success',
        })
      })
    })
  }
})


//NEW SHARE FEATURE
apiRoutes.post('/shareNote', (req,res) =>{
  const noteID = req.body.noteID
  const recipientID = req.body.recipient
  const token = req.headers.authorization.split(' ')[1]
  if (token) {
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: err,
        })
      }
      Note.findById(noteID, (note) => {
        note.sharedTo.push(recipientID)
        note.save((err)=> {
          if (err) throw err
          res.json({
            success:true,
            message:"note shared"
          })
        })
      })
    })
  }
})
// apply the routes to our application with the prefix /api

app.use('/api', apiRoutes)


// function isLoggedIn(req,res,next){
//   const token = req.headers['authorization'].split(' ')[1]
//   if (token){
//     jwt.verify(token, app.get('superSecret'), function(err, decoded){
//       if (err) {
//         res.redirect('login')
//       } else {
//         return next()
//       }
//     })
//   }
// }

app.listen(3000, () => {
  console.log('listening')
})
