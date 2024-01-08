export class OrganizationAlreadyExistsError extends Error {
  constructor() {
    super('Organization already exists')
    this.name = 'OrganizationAlreadyExistsError'
  }
}
