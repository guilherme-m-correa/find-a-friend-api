import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcrypt'
import { expect, describe, it, beforeEach } from 'vitest'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new AuthenticateUseCase(organizationsRepository)
  })

  it('should be able to authenticate', async () => {
    await organizationsRepository.create({
      responsible_name: 'John Doe',
      email: 'john.doe@example.com',
      zip_code: '12345678',
      address: 'John Doe Street',
      password_hash: await hash('123456', 6),
      whatsapp_number: '123456789',
    })

    const { organization } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with invalid email', async () => {
    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with invalid password', async () => {
    await organizationsRepository.create({
      responsible_name: 'John Doe',
      email: 'john.doe@example.com',
      zip_code: '12345678',
      address: 'John Doe Street',
      password_hash: await hash('123456', 6),
      whatsapp_number: '123456789',
    })

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: 'invalid-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
