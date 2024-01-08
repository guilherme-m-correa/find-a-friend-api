import { Organization, Prisma } from '@prisma/client'
import { OrganizationsRepository } from '../organizations-repository'
import { prisma } from '@/lib/prisma'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async findByEmail(email: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: { email },
    })

    if (!organization) return null

    return organization
  }

  create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization = prisma.organization.create({ data })

    return organization
  }
}
