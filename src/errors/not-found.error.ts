export class NotFoundError extends Error {
  readonly message: string;
  readonly statusCode: number;
  readonly error: string;

  constructor(message: string) {
    super();
    this.message = message;
    this.statusCode = 404;
    this.error = "Not Found";
  }
}
