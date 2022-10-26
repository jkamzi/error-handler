import HttpError, { isHttpError } from '../lib/httpError';

export type ConvertFn = (err: Error) => HttpError;

export type ConvertErrors = {
  [key: string]: ConvertFn;
};

/**
 * Convert errors from `Error` to `HttpError` if conditions are meet.
 *
 * `Error` will be converted if `convert` contains a key matching that
 * of `Error.name`.
 *
 * ```ts
 * const maybeHttpError = convertErrors(myError, {
 *  SyntaxError: (err) => new HttpError(400, 'Syntax Error', err),
 * });
 * ```
 *
 * Catch all (`*`) can be used to convert any error not converted.
 * ```ts
 * const maybeHttpError = convertErrors(myError, {
 *  '*': (err) => new HttpError(500, 'Internal Server Error', err),
 * });
 * ```
 *
 * If an error is not converted the original error is returned.
 *
 * @param err
 * @param convert
 * @returns
 */
export default function convertErrors(
  err: Error,
  convert: ConvertErrors,
): Error | HttpError {
  if (isHttpError(err)) {
    return err;
  }

  const namedError = Object.keys(convert);

  if (namedError.includes(err.name)) {
    return convert[err.name](err);
  }

  if (namedError.includes('*')) {
    return convert['*'](err);
  }

  return err;
}
