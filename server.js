var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    jwt    = require('jsonwebtoken'),
    User = require('./src/models/users'),
    Note = require('./src/models/notes'),
    Router = require('react-router'),
    morgan      = require('morgan'),
    ejwt = require('express-jwt'),
    sha1 = require('sha1')
    ObjectId = require('mongoose').Types.ObjectId;



//========
// CONFIG
// =======

mongoose.connect("mongodb://127.0.0.1:27017/jira-text-editor", { useNewUrlParser: true })
.catch((err) => {
  console.log(err)
});

User.find({}, function(err,user){
  console.log(user)
})



var app = express();
app.use(morgan('dev'));

app.set('superSecret', "hello it's me again")

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(function (req,res,next){
  res.locals.currentUser =req.user
  res.locals.test = 1234
  next()
})


//========
// ROUTES
// =======
app.get('/setup', function(req, res) {
  let pass = sha1('password')
  // create a sample user
  var nick = new User({
    username: 'username1',
    mail:'testmail@mail.com',
    admin: true
  });

  let pwd = sha1(pass + nick._id)
  nick.password = pwd
  // save the sample user
  nick.save(function(err) {
    if (err) {
      res.json({success:false,err:err})
    } else {
      console.log('User saved successfully');
      res.json({ success: true,user:nick });
    };

  });
});


var staticPath = path.join(__dirname, './public');
app.use(express.static(staticPath));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});
app.get('/login', function(req,res){
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})
app.get('/register', (req,res)=>{
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})

app.get('/note/:id', (req,res) =>{
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})

app.get('/admin', (req,res) => {
  res.sendFile(path.resolve(__dirname,'./public', 'index.html'))
})


// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

//route to authenticate a user (POST http://localhost:8080/api/authenticate)

apiRoutes.post('/login', function(req, res) {

  // find the user
  User.findOne({
     $or: [
            { "username" : req.body.name },
            { "mail": req.body.name }
          ]
   }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      let hashedPassword  = sha1(req.body.password)
      let pwd = sha1(hashedPassword + user._id)
      // check if password matches
      if (user.password != pwd) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      id:user._id,
      admin: user.admin
    };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: '7d' // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        })
      }

    }

  });
});

apiRoutes.post("/register", function(req,res){
  let hashedPassword = sha1(req.body.password)

  let newUser  = new User({username:req.body.name,mail:req.body.mail})
  let pwd = sha1(hashedPassword + newUser._id)
  newUser.password = pwd
  newUser.save(function(err){
    if (err) throw err
    const payload = {
      id:newUser._id,
      admin:newUser.admin
    }

    var token = jwt.sign(payload,app.get('superSecret'),{expiresIn:'7d'})

    // return the information including token as JSON
    res.json({
      success: true,
      message: 'Enjoy your token!',
      token: token
    })
  })



})

apiRoutes.get('/auth', (req,res)=> {
  let token = req.headers['authorization'].split(' ')[1]
  if(token){
    console.log(token)
  jwt.verify(token, app.get('superSecret'), function(err, decoded) {
  if (err) {
    res.json({
      success:false,
      message:err
    })
  }
  User.findOne({_id:decoded.id},function(err,user){
    res.json({
      success:true,
      user:user})
  })
})
}})


apiRoutes.post('/saveNote', (req,res)=> {
  let token = req.headers['authorization'].split(' ')[1]
  console.log(req.body.savedNote)
  if (token){
  jwt.verify(token, app.get('superSecret'), function(err, decoded){
    if (err) {
      res.json({
        success:false,
        message:err
      })
    }
    User.findOne({_id:decoded.id}, function(err,result){
      console.log(result)
      if (err) throw err
      if (!req.body.savedNote){
        let note = new Note ({title:req.body.title,value:req.body.value})
        result.notes.push(note)

        result.save(function(err){
          if (err) throw err
          res.json({
            success:true,
            note:note._id,
            message:"Note successfully saved"
          })
        })
      }else {
        let updatedNote = {value:req.body.value,title:req.body.title}
        let id = req.body.savedNote._id
        console.log({id})
        result.notes.findOneAndUpdate({"notes._id":id},{"notes.$":updatedNote},{new:true},function(err,updated){
          if (err) throw err
          if (!updated){
            console.log({updated})
            res.json({success:false,message:'Cant find the note'})
          } else {
            res.json({success:true,message:'Note updated'})
          }

        })
        // let toBeUpdatedNote = user.notes.filter(note => note.id == req.body.savedNote._id)
        // let index = user.notes.findIndex(note => note.id == req.body.savedNote._id )
        // toBeUpdatedNote
      }
    })
  }
)

}})

apiRoutes.get('/getUserNotes', (req,res)=> {
  let token = req.headers['authorization'].split(' ')[1]
  if (token){
    jwt.verify(token, app.get('superSecret'), function(err, decoded){
      if (err) {
        res.status(401).json({
          success:false,
          message:err
        })
      }
      User.findOne({_id:decoded.id},function(err,result){
        res.json({
          notes:result.notes
        })
      })
    })
  }
})

apiRoutes.get('/note/:id', (req,res)=>{
  let token = req.headers['authorization'].split(' ')[1]
  if (token){
    jwt.verify(token, app.get('superSecret'), function(err, decoded){
      if (err) {
        res.json({
          success:false,
          message:err
        })
      }
      User.findOne({_id:decoded.id}, (err,user) => {
        if (err) throw err
        let note = user.notes.filter(note => note._id == req.params.id)
        console.log(note)
        res.json({
          success:true,
          note:note[0]
        })
      })
  })
  }
})

apiRoutes.get('/eraseNote/:id', (req,res)=>{
  let token = req.headers['authorization'].split(' ')[1]
  if (token){
    jwt.verify(token, app.get('superSecret'), function(err, decoded){
      if (err) {
        res.json({
          success:false,
          message:err
        })
      }
      User.findOne({_id:decoded.id}, (err,user) => {
        if (err) throw err
        let index = user.notes.findIndex(note => note._id == req.params.id)
        user.notes.splice(index,1)
        user.save(function(err){
          if (err) throw err
          res.json({
            success:true,
            message:"Note has been erase with success",
            notes:user.notes
          })
        })

      })
  })
  }
})
// apply the routes to our application with the prefix /api

app.use('/api', apiRoutes);




// function isLoggedIn(req,res,next){
//   let token = req.headers['authorization'].split(' ')[1]
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

app.listen(3000, function() {
  console.log('listening');
});
