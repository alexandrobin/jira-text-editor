var mongoose= require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')
var UserSchema = new mongoose.Schema({
  firstname:String,
  lastname:String,
  username:String,
  password:String,
  admin:Boolean
})

UserSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model("User", UserSchema)
