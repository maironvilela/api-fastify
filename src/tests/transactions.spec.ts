import { afterAll, beforeAll, expect, describe, it, beforeEach } from 'vitest'
import { app } from '../config/app'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')

    execSync('npm run knex migrate:latest')
  })

  it('Should be able create a transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'Test Transaction',
      amount: 100,
      type: 'credit',
    })

    expect(response.statusCode).toBe(201)
  })

  it('Should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 100,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') || ['']

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Test Transaction',
        amount: 100,
      }),
    ])
  })

  it.todo('Should be able get transaction by id', () => {})
  it.todo('Should be able get the transaction summary', () => {})
})
