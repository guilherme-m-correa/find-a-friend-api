import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/organizations').send({
      responsibleName: 'John Doe',
      email: 'john.doe@example.com',
      zipCode: '12345678',
      address: 'John Doe Street',
      password: '123456',
      whatsappNumber: '123456789',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    })
  })
})
