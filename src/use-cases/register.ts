import { OrganizationAlreadyExistsError } from '@/use-cases/errors/organization-already-exists'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { Organization } from '@prisma/client'
import { hash } from 'bcrypt'

interface RegisterUseCaseInput {
  responsibleName: string
  email: string
  zipCode: string
  address: string
  whatsappNumber: string
  password: string
}

interface RegisterUseCaseOutput {
  organization: Organization
}

export class RegisterUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    responsibleName,
    email,
    zipCode,
    address,
    whatsappNumber,
    password,
  }: RegisterUseCaseInput): Promise<RegisterUseCaseOutput> {
    const organizationAlreadyExists =
      await this.organizationsRepository.findByEmail(email)

    if (organizationAlreadyExists) throw new OrganizationAlreadyExistsError()

    const passwordHash = await hash(password, 6)

    const organization = await this.organizationsRepository.create({
      responsible_name: responsibleName,
      email,
      zip_code: zipCode,
      address,
      password_hash: passwordHash,
      whatsapp_number: whatsappNumber,
    })

    return {
      organization,
    }
  }
}
