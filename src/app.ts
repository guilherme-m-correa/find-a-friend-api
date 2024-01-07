import fastify from 'fastify'
import { z } from 'zod'
import { env } from './env'

export const app = fastify({
  logger: env.NODE_ENV === 'development',
})

app.get('/', async (_, reply) => {
  return reply.send({ message: 'Find A Friend API' })
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof z.ZodError) {
    const formattedErrors = error.issues.map((issue) => {
      return {
        path: issue.path.join('.'),
        message: issue.message,
      }
    })

    return reply.status(400).send({ errors: formattedErrors })
  }

  if (env.NODE_ENV === 'development') console.error(error)

  return reply.status(500).send({ message: 'Internal Server Error' })
})
