# Developer setup

## Prerequisites

- Node.js 20 LTS or later
- npm 10 or later
- MongoDB Atlas database or local MongoDB

## Install and run

```bash
# Terminal 1 — API
cd server
npm install
npm run dev

# Terminal 2 — web client
cd client
npm install
npm run dev
```

The server uses `PORT=5000` in `server/.env`. The Vite client runs on `http://localhost:5173` and defaults to `http://localhost:5000/api/v1`.

## Environment files

Never commit real credentials. Use local `.env` files.

`server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/resuma-college
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
PAYLOAD_LIMIT=10kb
```

`client/.env` (optional; the shown value is the default):

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Commands

| Location | Command | Purpose |
| --- | --- | --- |
| `client/` | `npm run dev` | Start Vite development server. |
| `client/` | `npm run build` | Verify a production client build. |
| `server/` | `npm run dev` | Start Express through nodemon. |
| `server/` | `npm test` | Run Vitest tests. |
| `server/` | `npm run test:coverage` | Generate backend coverage. |

## Development workflow

1. Read or write the contract in `docs/api/`.
2. Implement validation and five-layer server feature code.
3. Add integration tests for success, validation, authorization, and ownership failures.
4. Add client API function, data-route action/loader, and feature UI.
5. Run client build and relevant server tests before opening a pull request.

## Troubleshooting

`ERR_CONNECTION_REFUSED` means the API process is not listening at the configured host/port. Confirm `server/.env` port and run `npm run dev` from `server/`. It is not a React Router error.

If cookies are missing, confirm `withCredentials: true`, the exact client origin in `CORS_ORIGIN`, and `sameSite`/`secure` configuration appropriate to the environment.
