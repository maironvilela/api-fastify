import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRouter } from '../router/transactions'

export const app = fastify()

app.register(cookie)
app.register(transactionsRouter, {
  prefix: 'transactions',
})
