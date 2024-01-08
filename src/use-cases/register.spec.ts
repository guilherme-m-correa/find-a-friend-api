import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { compare } from 'bcrypt'
import { OrganizationAlreadyExistsError } from '@/use-cases/errors/organization-already-exists'

describe('Register usecase unit tests', () => {
  let sut: RegisterUseCase
  let organizationsRepository: OrganizationsRepository

  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new RegisterUseCase(organizationsRepository)
  })

  it('should be able to register a new organization', async () => {
    const { organization } = await sut.execute({
      responsibleName: 'John Doe',
      email: 'john.doe@example.com',
      zipCode: '12345678',
      address: 'John Doe Street',
      password: '123456',
      whatsappNumber: '123456789',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should hash organization password upon registration', async () => {
    const { organization } = await sut.execute({
      responsibleName: 'John Doe',
      email: 'john.doe@example.com',
      zipCode: '12345678',
      address: 'John Doe Street',
      password: '123456',
      whatsappNumber: '123456789',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      organization.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a new organization with an email that is already in use', async () => {
    await organizationsRepository.create({
      responsible_name: 'John Doe',
      email: 'john.doe@example.com',
      zip_code: '12345678',
      address: 'John Doe Street',
      password_hash: '123456',
      whatsapp_number: '123456789',
    })

    await expect(
      sut.execute({
        responsibleName: 'John Doe',
        email: 'john.doe@example.com',
        zipCode: '12345678',
        address: 'John Doe Street',
        password: '123456',
        whatsappNumber: '123456789',
      }),
    ).rejects.toBeInstanceOf(OrganizationAlreadyExistsError)
  })
})
