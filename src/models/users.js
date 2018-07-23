var mongoose= require('mongoose')

var NoteSchema = new mongoose.Schema({
  title:String,
  value:String,
  status:Number, //0 - Draft // 1 - Active // 2 - Archive
  ts:{type:Date, required:true, default:Date.now}
})

var UserSchema = new mongoose.Schema({
  username:{type: String, required: true, unique: true},
  firstName:{type:String},
  lastName:{type:String},
  mail:{type: String, required: true, unique: true},
  password:{type: String, required: true},
  admin:Boolean,
  notes:[NoteSchema]
})


module.exports=mongoose.model("User", UserSchema)
