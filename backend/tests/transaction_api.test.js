const supertest = require('supertest')
const mongoose = require('mongoose')
const { test, describe, after, beforeEach } = require('node:test')
const app = require('../app')
const api = supertest(app)
const assert = require('assert')
const helper = require('./test_helper')

const Transaction = require('../models/transaction')

describe('when there is initially some transactions', () => {

  beforeEach(async () => {
    await Transaction.deleteMany({})

    const transactionObjects = helper.initialTransactions
      .map(transaction => new Transaction(transaction))
      
    const promiseArray = transactionObjects.map(transaction => transaction.save())
    await Promise.all(promiseArray)
  })

  test('initial transactions in DB are returned as json', async () => {
    const res = await api
      .get('/api/transactions')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, helper.initialTransactions.length)
  })

  test('transactions are returned with the id', async () => {
    const res = await api.get('/api/transactions')
    res.body.forEach(transaction => {
      assert(transaction.id)
    })
  })

  test('a valid new transaction can be added', async () => {
    const newTransaction = {
      title: 'Breakfast',
      type: 'Expense',
      date: '2021-10-04',
      amount: 5.99
    }

    const postRes = await api
      .post('/api/transactions')
      .send(newTransaction)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      // .set('Authorization', `Bearer ${token}`)
 
    assert.strictEqual(postRes.body.title, newTransaction.title)
    assert.strictEqual(postRes.body.type, newTransaction.type)
    assert.strictEqual(postRes.body.date, newTransaction.date)
    assert.strictEqual(postRes.body.amount, newTransaction.amount)

    const transactionsAtEnd = await helper.transactionsInDb()
    const titles = transactionsAtEnd.map(transaction => transaction.title)
    assert.strictEqual(titles.includes(postRes.body.title), true)
  })

  test('deleting a transaction is possible', async () => {
    const transactionToDelete = {
      title: 'Deleted soon',
      type: 'Expense',
      date: '2021-10-04',
      amount: 5.99
    }

    const res = await api
      .post('/api/transactions')
      .send(transactionToDelete)
    
    const id = res.body.id
    const transactionsAtStart = await helper.transactionsInDb()

    await api
      .delete(`/api/transactions/${id}`)
      .expect(204)

    const transactionsAtEnd = await helper.transactionsInDb()
    assert.strictEqual(transactionsAtEnd.length, transactionsAtStart.length - 1)
    const titles = transactionsAtEnd.map(transaction => transaction.title)
    assert.strictEqual(titles.includes(res.body.title), false)
  })

  test("updating a transaction's amount is possible", async () => {
    const transactionsAtStart = await helper.transactionsInDb()
    const transactionToUpdate = transactionsAtStart[0]
    const newTransaction = {
      title: "Updated Title",
      type: transactionToUpdate.type,
      date: transactionToUpdate.date,
      amount: 100
    }

    await api
      .put(`/api/transactions/${transactionToUpdate.id}`)
      .send(newTransaction)
      .expect(200)
    
    const transactionsAtEnd = await helper.transactionsInDb()
    const updatedTransaction = transactionsAtEnd.find(transaction => transaction.id === transactionToUpdate.id)
    assert.strictEqual(transactionsAtEnd.length === transactionsAtStart.length, true)
    assert.strictEqual(updatedTransaction.amount, newTransaction.amount)
    assert.strictEqual(updatedTransaction.title, newTransaction.title)
    assert.strictEqual(updatedTransaction.type, newTransaction.type)
  })
})

after(async () => {
  await mongoose.connection.close()
})

// test('getting a single transaction', async () => {
//   const transactionsAtStart = await helper.transactionsInDb()
//   const transactionToGet = transactionsAtStart[0]

//   const res = await api
//     .get(`/api/transactions/${transactionToGet.id}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   const processedTransactionToGet = JSON.parse(JSON.stringify(transactionToGet))
//   assert.deepStrictEqual(res.body, processedTransactionToGet)
// })