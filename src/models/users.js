var mongoose= require('mongoose')
var NoteSchema = require('./users.js')

var UserSchema = new mongoose.Schema({
  username:{type: String, required: true, unique: true},
  firstName:{type:String},
  lastName:{type:String},
  mail:{type: String, required: true, unique: true},
  password:{type: String, required: true},
  admin:Boolean,
  notes:[NoteSchema]
})


module.exports= mongoose.model("User",UserSchema)
