var mongoose= require('mongoose')

var UserSchema = new mongoose.Schema({
  username:{type: String, required: true, unique: true},
  firstName:{type:String},
  lastName:{type:String},
  mail:{type: String, required: true, unique: true},
  password:{type: String, required: true},
  admin:Boolean,
  notes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Note'
  }]
})


module.exports= mongoose.model("User",UserSchema)
