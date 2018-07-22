var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    jwt    = require('jsonwebtoken'),
    User = require('./src/models/users'),
    //Note = require('./src/models/users'),
    Router = require('react-router'),
    morgan      = require('morgan'),
    ejwt = require('express-jwt'),
    sha1 = require('sha1')



//========
// CONFIG
// =======

mongoose.connect("mongodb://127.0.0.1:27017/jira-text-editor", { useNewUrlParser: true })
.catch((err) => {
  console.log(err)
});



var app = express();
app.use(morgan('dev'));

app.set('superSecret', "hello it's me again")

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(function (req,res,next){
  console.log(req.user)
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


// app.use(ejwt({
//   secret:app.get('superSecret')
//   // getToken: function fromHeaders (req) {
//   //     var token = req.headers['Authorization']
//   //     if (token) {
//   //       return token;
//   //     }
//   //     return null;
//   //   }
//   }
// )
//   .unless({path:[
//     '/',
//     '/login',
//     '/register',
//     '/api/login',
//     '/dll/vendor.js',
//     '/index.js',
//     '/api/register',
//     '/api/auth'
// ]}))





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
            { username : req.body.name },
            { mail: req.body.name }
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
  req.body.note
  req.body.title
  let note = new Note ({title:req.body.title,value:req.body.note})

  let token = req.headers['authorization'].split(' ')[1]
  if (token){
  jwt.verify(token, app.get('superSecret'), function(err, decoded){
    if (err) {
      res.json({
        success:false,
        message:err
      })
    } else {
      User.findOne({_id:decoded.id}, function(err,user){
        user.notes=[]
        if (err) throw err
        if (!err){
          user.notes.push(note)

        user.save(function(err){
          if (err) throw err
        })
      }
      })
    }
  })

}})
// apply the routes to our application with the prefix /api

app.use('/api', apiRoutes);




function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('login')
}

app.listen(3000, function() {
  console.log('listening');
});
