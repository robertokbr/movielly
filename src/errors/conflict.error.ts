export class ConflictError extends Error {
  readonly message: string;
  readonly statusCode: number;

  constructor(message: string) {
    super();
    this.message = message;
    this.statusCode = 409;
  }
}
