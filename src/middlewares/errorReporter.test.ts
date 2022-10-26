import { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import HttpError from '../lib/httpError';
import errorReporter from './errorReporter';

const template = (err: HttpError) => ({
  error: {
    message: err.message,
    status: err.status,
  },
});

function createResponseMock(): Response {
  const response: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  return response as Response;
}

describe('errorReporter/1', () => {
  it('should call next() when error is not HttpError and not converted', () => {
    const next = vi.fn();
    const response = createResponseMock();
    const mw = errorReporter({
      template,
    });
    const err = new SyntaxError("Unexpected token '.'");
    mw(err, {} as Request, response, next);

    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(err);
  });

  it('should convert error and call res.json() with HttpError', () => {
    const next = vi.fn();
    const response = createResponseMock();
    const mw = errorReporter({
      template,
      convert: {
        SyntaxError: (err) => new HttpError(400, 'Syntax Error', err),
      },
    });

    mw(new SyntaxError("Unexpected token '.'"), {} as Request, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        message: 'Syntax Error',
        status: 400,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call res.json() with expected error', () => {
    const next = vi.fn();
    const response = createResponseMock();
    const mw = errorReporter({
      template,
    });

    mw(new HttpError(400, 'Bad Request'), {} as Request, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        message: 'Bad Request',
        status: 400,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
