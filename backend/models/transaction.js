const mongoose = require('mongoose')

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Income', 'Expense']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  }
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.date = returnedObject.date.toISOString().substring(0, 10)
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Transaction = mongoose.model('Transaction', schema)
module.exports = Transaction