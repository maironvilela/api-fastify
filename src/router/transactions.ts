import { FastifyInstance } from 'fastify'
import { knex } from '../../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionId } from '../middleweres/check-session-id'

export async function transactionsRouter(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {})

  app.post('/', async (request, reply) => {
    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    }

    const createtransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createtransactionBodySchema.parse(
      request.body
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return reply.send({ transactions })
    }
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionId],
    },
    async (request, _reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { sessionId } = request.cookies

      const { id } = getTransactionParamsSchema.parse(request.params)

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return { transaction }
    }
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionId],
    },
    async (request, _reply) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()

      return { summary }
    }
  )
}
