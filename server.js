var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose')
    User = require('./src/models/users')
    Router = require('react-router')

    mongoose.connect("mongodb://127.0.0.1:27017/jira-text-editor", { useNewUrlParser: true })
    .catch((err) => {
      console.log(err)
    });




var app = express();

app.use(require('express-session')({
  secret:"back at Ubi and doing some Magic",
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({extended:true}))
app.use(function (req,res,next){
  console.log(req.user)
  res.locals.currentUser =req.user
  res.locals.test = 1234
  next()
})

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//========
// ROUTES
// =======
app.post("/register", function(req,res){
  req.body.username
  req.body.password
  User.register(new User({username:req.body.username}), req.body.password, function(err,user){
    if(err){
      console.log(err)
      return res.redirect('/register')
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect('/secret')
    })
  })
})

app.post("/login", passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/register"
}), function(req,res){

})

app.get('/logout', isLoggedIn, function(req,res){
  req.logout()
  res.redirect('/')
})


var staticPath = path.join(__dirname, './public');
app.use(express.static(staticPath));
app.get('/', (req, res) => {
  console.log(req.user)
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('login')
}

app.listen(3000, function() {
  console.log('listening');
});
