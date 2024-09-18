const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// let expenses = [
//   {
//     id: 1,
//     title: 'Lunch',
//     type: 'Expenses',
//     date: '2021-10-01',
//     amount: 12.99
//   },
//   {
//     id: 2,
//     title: 'Dinner',
//     type: 'Expenses',
//     date: '2021-10-02',
//     amount: 25.99
//   }
// ]

// app.get('/api/expenses', (req, res) => {
//   res.json(expenses)
// })

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/api/expenses/:id', (req, res) => {
//   const id = req.params.id
//   const expense = expenses.find(expense => expense.id === id)
//   if (expense) {
//     res.json(expense)
//   } else {
//     res.status(404).end()
//   }
// })

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})