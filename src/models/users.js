var mongoose= require('mongoose')
var UserSchema = new mongoose.Schema({
  username:String,
  mail:String,
  password:String,
  admin:Boolean
})


module.exports=mongoose.model("User", UserSchema)
