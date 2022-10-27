import { describe, expect, it } from 'vitest';
import HttpError, { isHttpError } from './httpError';

describe('HttpError', () => {
  it('should accept status code and message', () => {
    const err = new HttpError(400, 'Bad Request');

    expect(err.status).toEqual(400);
    expect(err.message).toEqual('Bad Request');
    expect(err.isHttpError).toBeTruthy();
  });

  it('should accept status code, message and Error', () => {
    const previous = new Error('No authorization token');
    const err = new HttpError(401, 'Forbidden', previous);

    expect(err.status).toEqual(401);
    expect(err.message).toEqual('Forbidden');
    expect(err.previous).toEqual(previous);

    expect(err.isHttpError).toBeTruthy();
  });

  it('should accept unknwon as previous', () => {
    const previous: unknown = undefined;
    const err = new HttpError(401, 'Forbidden', previous);

    expect(err.previous).not.toBeDefined();
  });

  describe('isHttpError/1', () => {
    it('should return true when error is HttpError', () => {
      const err = new HttpError(400, 'Bad Request');

      expect(isHttpError(err)).toBeTruthy();
    });
    it('should return false when error is not HttpError', () => {
      const err = new Error('Bad Request');

      expect(isHttpError(err)).not.toBeTruthy();
    });
  });
});
