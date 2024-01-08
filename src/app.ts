import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { z } from 'zod'
import { env } from './env'
import { organizationRoutes } from './http/controllers/organizations/routes'

export const app = fastify({
  logger: env.NODE_ENV === 'development',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})
app.register(fastifyCookie)

app.get('/', async (_, reply) => {
  return reply.send({ message: 'Find A Friend API' })
})

app.register(organizationRoutes)

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
