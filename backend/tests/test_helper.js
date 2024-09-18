const Transaction = require('../models/transaction')

const initialTransactions = [
  {
    id: 1,
    title: 'Lunch',
    type: 'Expense',
    date: '2021-10-01',
    amount: 12.99
  },
  {
    id: 2,
    title: 'Dinner',
    type: 'Expense',
    date: '2021-10-02',
    amount: 25.99
  },
  {
    id: 3,
    title: 'Salary',
    type: 'Income',
    date: '2021-10-03',
    amount: 300
  }
]

const transactionsInDb = async () => {
  const transactions = await Transaction.find({})
  return transactions.map(transaction => transaction.toJSON())
}

module.exports = {
  initialTransactions,
  transactionsInDb
}