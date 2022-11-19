# Express Error middleware

## Install

```bash
$ npm i @jansson/error-handler
```

## Usage

```ts
import express from 'express';
import { errorReporter } from '@jansson/error-handler';

const app = express();

function errorTemplate(error: HttpError) {
  return {
    error: {
      message: error.message,
      status: error.status,
    },
  };
}

// Routes [...]

// At the end of your general routes
app.use(
  errorReporter({
    template: errorTemplate,
  }),
);
```

### Alternative template

```ts
function getErrorTemplate(showDetailedErrors = false) {
  return (error: HttpError) => {
    return {
      error: {
        message: error.message,
        status: error.status,
        // Conditionally show `stack` and `previous` if
        // `showDetailedErrors` is true.  Not recomended for production
        ...(showDetailedErrors && {
          stack: error.stack,
          // Include previous if exists
          ...(error.previous && {
            message: error.previous.message,
            stack: error.previous.stack,
          }),
        }),
      },
    };
  };
}

app.use(
  errorReporter({
    // This will show detailed errors
    // when NODE_ENV is development
    template: getErrorTemplate(process.env.NODE_ENV === 'development'),
  }),
);
```
