const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  title: String,
  value: String,
  status: Number, // 0 - Draft // 1 - Active // 2 - Archive
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sharedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  ts: { type: Date, required: true, default: Date.now },
})


module.exports = mongoose.model('Note', NoteSchema)
