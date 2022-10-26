/**
 * Check if a given error is HttpError
 *
 * @param error
 * @returns
 */
export function isHttpError(error: unknown): error is HttpError {
  return (error as HttpError).isHttpError === true;
}

export default class HttpError extends Error {
  public isHttpError = true;

  public status: number;
  public previous?: Error;

  constructor(status: number, message: string, previous?: Error) {
    super(message);
    this.status = status;
    this.previous = previous;

    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
