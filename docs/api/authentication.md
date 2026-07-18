# Authentication API

Prefix: `/api/v1/public/auth`  
Status: **Implemented**

The browser client uses cookies. Axios is configured with `withCredentials: true`; the server CORS allow-list must contain the client origin.

## `POST /register`

Creates an account, creates access/refresh token cookies, and returns the new user plus the short-lived access token.

| Input | Type | Rules |
| --- | --- | --- |
| `firstName` | string | 2–50 trimmed characters. |
| `lastName` | string | 2–50 trimmed characters. |
| `email` | string | Valid, lowercased email. |
| `password` | string | 8–128 chars, uppercase, lowercase, number, special character. |

```http
POST /api/v1/public/auth/register
Content-Type: application/json

{"firstName":"Ada","lastName":"Lovelace","email":"ada@example.com","password":"Secure#Pass1"}
```

Returns `201`. A duplicate email returns `409` with `User already exists`.

## `POST /login`

```http
POST /api/v1/public/auth/login
Content-Type: application/json

{"email":"ada@example.com","password":"Secure#Pass1"}
```

Returns `200` and the same response `data` shape as registration. Invalid credentials return `401` without revealing which field failed.

## `GET /me`

Requires a valid `accessToken` cookie or `Authorization: Bearer <token>` header.

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Current user fetched successfully",
  "data": { "_id": "…", "firstName": "Ada", "lastName": "Lovelace", "email": "ada@example.com" }
}
```

Returns `401` if the session is absent, expired, invalid, or refers to a removed user; `403` if the account is disabled.

## `POST /logout`

Requires authentication. Revokes the stored refresh token and clears the auth cookies. Returns `200`.

## Authentication flow

```text
Register/Login action
  → server validates input
  → service hashes/verifies password and issues JWTs
  → server sets HttpOnly cookies
  → client stores only user/UI session state in Redux
  → redirect to /dashboard
  → protected dashboard loader calls GET /me
```

## Required server configuration

```env
PORT=5000
MONGO_URI=mongodb://...
ACCESS_TOKEN_SECRET=long-random-secret
REFRESH_TOKEN_SECRET=long-random-secret
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

The access-token JWT payload uses `_id`. Authentication middleware must verify using `ACCESS_TOKEN_SECRET` and look up `decoded._id`.

## Next auth work

Design and add refresh-token rotation, email verification, password reset, rate limits per auth action, and role middleware before exposing admin routes. These are not currently implemented endpoints.
