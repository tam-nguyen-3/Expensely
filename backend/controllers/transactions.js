const router = require('express').Router()
const Transaction = require('../models/transaction')

// get all transactions
router.get('/', async (req, res) => {
  const transactions = await Transaction.find({})
  res.json(transactions)
})

// get a single transaction
router.get('/:id', async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (transaction) {
    res.json(transaction)
  } else {
    res.status(404).end()
  }
})

// create a new transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    title: req.body.title,
    type: req.body.type,
    amount: req.body.amount,
    date: new Date(req.body.date)
  })
  // const transaction = new Transaction(req.body)

  if (!transaction.title || !transaction.type || !transaction.amount) {
    return res.status(400).json({ error: 'content missing' })
  }

  if (Number.isNaN(transaction.amount)) {
    return res.status(400).json({ error: 'amount must be a number' })
  }

  const savedTransaction = await transaction.save()

  res.status(201).json(savedTransaction) 
})

// delete a transaction
router.delete('/:id', async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (!transaction) {
    return res.status(204).end()
  }
  await transaction.deleteOne()
  res.status(204).end()
})

// update a transaction
router.put('/:id', async (req, res) => {
  const transaction = {
    title: req.body.title,
    type: req.body.type,
    amount: req.body.amount,
    date: new Date(req.body.date)
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, transaction, { new: true })
  res.json(updatedTransaction)
})

module.exports = router