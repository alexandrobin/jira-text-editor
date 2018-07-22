var mongoose= require('mongoose')

// var NoteSchema = new mongoose.Schema({
//   title:String,
//   value:String,
//   status:Number, //0 - Draft // 1 - Active // 2 - Archive
//   ts:{type:Date, required:true, default:Date.now}
// })


module.exports=mongoose.model("Note", NoteSchema)
