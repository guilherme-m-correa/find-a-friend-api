import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/organizations').send({
      responsibleName: 'John Doe',
      email: 'john.doe2@example.com',
      zipCode: '12345678',
      address: 'John Doe Street',
      password: '123456',
      whatsappNumber: '123456789',
    })

    expect(response.statusCode).toEqual(201)
  })
})
