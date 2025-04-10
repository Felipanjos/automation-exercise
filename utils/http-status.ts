// http-status.ts
export const HTTP = {
  RESPONSE_TIME: 2000,
  STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_SUPPORTED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
} as const;
