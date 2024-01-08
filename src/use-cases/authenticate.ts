import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { Organization } from '@prisma/client'
import { compare } from 'bcrypt'

interface AuthenticateUseCaseInput {
  email: string
  password: string
}

interface AuthenticateUseCaseOutput {
  organization: Organization
}

export class AuthenticateUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseInput): Promise<AuthenticateUseCaseOutput> {
    const organization = await this.organizationsRepository.findByEmail(email)

    if (!organization) {
      throw new InvalidCredentialsError()
    }

    const doestPasswordMatches = await compare(
      password,
      organization.password_hash,
    )

    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      organization,
    }
  }
}
