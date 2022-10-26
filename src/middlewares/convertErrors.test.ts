import { describe, expect, it } from 'vitest';
import HttpError from '../lib/httpError';
import convertErrors from './convertErrors';

describe('convertErrors/2', () => {
  it('should not convert HttpError when wildcard is set', () => {
    const err = new HttpError(400, 'Bad Request');
    const result = convertErrors(err, {
      '*': (err) => new HttpError(500, 'Internal Server Error', err),
    });

    expect(result).toEqual(err);
  });

  it('should call next() without converting error when no definition found for error', () => {
    const err = new SyntaxError('SyntaxError');
    const result = convertErrors(err, {});

    expect(result).toEqual(err);
  });

  it('should convert named error', () => {
    const err = new SyntaxError('SyntaxError');
    const result = convertErrors(err, {
      [err.name]: (err) => new HttpError(400, 'SyntaxError', err),
    });

    expect(result).toEqual(new HttpError(400, 'SyntaxError', err));
  });

  it('should call next() converting error using wildcard', () => {
    const err = new SyntaxError('SyntaxError');
    const result = convertErrors(err, {
      '*': (err) => new HttpError(400, 'WildCardError', err),
    });

    expect(result).toEqual(new HttpError(400, 'WildCardError', err));
  });

  it('should convert using named error when match is found and wildcard is defined', () => {
    const err = new SyntaxError('SyntaxError');
    const result = convertErrors(err, {
      '*': (err) => new HttpError(400, 'WildCardError', err),
      [err.name]: (err) => new HttpError(400, 'SyntaxError', err),
    });
    expect(result).toEqual(new HttpError(400, 'SyntaxError', err));
  });
});
