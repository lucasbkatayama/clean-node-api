export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal server errror')
    this.name = 'ServerError'
    this.stack = stack
  }
}
