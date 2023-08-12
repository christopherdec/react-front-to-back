const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true],
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  isStaff: {
    type: Boolean,
    required: true,
    default: false,
  },
  staffId: {
    type: String,
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Note', noteSchema)