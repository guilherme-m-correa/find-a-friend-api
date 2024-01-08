import { OrganizationAlreadyExistsError } from '@/use-cases/errors/organization-already-exists'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const registerBodySchema = z.object({
      responsibleName: z.string(),
      email: z.string().email(),
      zipCode: z.string(),
      address: z.string(),
      whatsappNumber: z.string(),
      password: z.string().min(6),
    })

    const {
      responsibleName,
      email,
      zipCode,
      address,
      whatsappNumber,
      password,
    } = registerBodySchema.parse(request.body)

    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      responsibleName,
      email,
      zipCode,
      address,
      whatsappNumber,
      password,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof OrganizationAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
