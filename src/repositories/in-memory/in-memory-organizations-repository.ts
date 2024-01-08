import { Organization, Prisma } from '@prisma/client'
import { OrganizationsRepository } from '../organizations-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  private organizations: Organization[] = []

  async findByEmail(email: string): Promise<Organization | null> {
    const organization = this.organizations.find(
      (organization) => organization.email === email,
    )

    if (!organization) return null

    return organization
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization: Organization = {
      id: data.id || randomUUID(),
      responsible_name: data.responsible_name,
      email: data.email,
      whatsapp_number: data.whatsapp_number,
      address: data.address,
      zip_code: data.zip_code,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.organizations.push(organization)

    return organization
  }
}
