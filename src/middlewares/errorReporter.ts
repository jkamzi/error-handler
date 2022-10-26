import { ErrorRequestHandler } from 'express';
import HttpError, { isHttpError } from '../lib/httpError';
import convertErrors, { ConvertErrors } from './convertErrors';

export type Template = (err: HttpError) => unknown;

export type ErrorReporterOptions = {
  template: Template;
  convert?: ConvertErrors;
};

/**
 *
 * @param options
 * @returns
 */
export default function errorReporter(
  options: ErrorReporterOptions,
): ErrorRequestHandler {
  const { template, convert } = options;

  return (err, req, res, next) => {
    const error = convertErrors(err, convert || {});
    if (isHttpError(error)) {
      const errorResponseBody = template(error);
      return res.status(400).json(errorResponseBody);
    }

    return next(error);
  };
}
