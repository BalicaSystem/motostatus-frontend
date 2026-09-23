## Objective
- **Backend JWT auth + tests** in `motostatus-api` (no frontend): users table, login endpoint, JWT-protected `/api/*` routes, full unit + e2e coverage, seed admin user. Decisions confirmed by user: backend + tests only; seed admin only (no register endpoint); no roles.

## Important Details
- Deps installed via `bun` (`bun.lock` updated): `@fastify/jwt@10.2.2`, `bcryptjs@3.0.3`. Runtime/scripts use Bun; tests run via vitest + supertest on Node.
- Env: `src/env/index.ts` requires `JWT_SECRET: z.string().min(16)`. In `.env` (`JWT_SECRET=dda63f3b0f587c9a32d2694e5cd22b16070d511adf344c86`). Test fallback in `src/test/setup/env.ts`: `process.env.JWT_SECRET ??= 'test-secret-8f2c1d9e3a7b4c5d6e7f8a9b0c1d2e3f'`. `.env` has a stray `R1LBKFCC84rE5w8D` line (left as-is, not in git).
- Schema: `users` table (id uuid pk defaultRandom, name, email unique, passwordHash, createdAt/updatedAt); `User`/`NewUser` types exported. Migration `drizzle/20260923151246_familiar_infant_terrible` generated, applied to real DB, and now committed.
- Flow: `POST /api/auth/login` (zod `{ email, password }`) → `AuthenticateUseCase` (framework-free, returns `userId` only) → controller `await reply.jwtSign({ sub: userId }, { expiresIn: '7d' })` → 200 `{ token, user: { id, email } }`. Auth module at `src/http/controllers/auth/` (login.ts, routes.ts).
- Guard: `onRequest` hook in `apiRoutes` (`src/http/controllers/index.routes.ts`) — skips `/api/auth/*`, else `try { await request.jwtVerify() } catch { throw new UnauthorizedError() }` → 401. `/health` stays public. All customers/motorcycles/orders routes now protected.
- Errors: `unauthorized-error.ts` (`'Unauthorized.'`) + `invalid-credentials-error.ts` (`'Invalid credentials.'`), both mapped to 401 in `app.ts`.
- Repos: `src/repositories/users-repository.ts` interface + `drizzle/drizzle-users-repository.ts` (findByEmail lowercases) + `in-memory/in-memory-users-repository.ts`; factory `make-authenticate-use-case.ts`; unit tests `authenticate.test.ts` (3 tests, in-memory, bcryptjs compare).
- Test helpers: `src/utils/test/create-user.ts` (random unique email by default, `TEST_PASSWORD = 'MotoStatus@2026!'`, bcrypt hash cost 6) + `authed-agent.ts` (creates user, `app.jwt.sign({ sub })`, returns `request.agent(app.server).set('Authorization', \`Bearer ${token}\`)` — supertest agent `set` persists across requests).
- All 20 existing controller e2e files updated: swap `request(app.server)` → `authenticated` (agent from `createAuthedAgent()`), add `users` to db.delete list. Files using `app.inject` (complete-order-item, release-order-item, reassign-motorcycle) got a local `inject(options: InjectOptions)` helper (type from `light-my-request`) that injects `headers: { authorization }`.
- New e2e: `login.test.ts` (4: 200 token+user, 401 wrong password, 401 unknown email, 400 invalid body) + `guard.test.ts` (4: 401 no token, 401 invalid token, 200 valid token, /health public).
- Seed (`src/db/seed.ts`): TRUNCATE now includes `users`; inserts admin `admin@motostatus.com.br` / `MotoStatus@2026!` (bcrypt cost 10), credentials printed at end.
- **Tests: 112 e2e + 68 unit all pass** (was 104/65). Committed `26ef32e` → `developer` pushed.
- TS: `bunx tsc --noEmit` shows **zero errors in all new auth files**; remaining repo errors are pre-existing baseline (never tsc-clean under `noUncheckedIndexedAccess` — e.g. `eq(customers.id, customer?.id)`, order insert overloads, in-memory repos, `seed.ts` `pick`, `vitest.e2e.config.ts` minWorkers). Not in scope to fix.
- Gotchas hit: `expect(...).rejects` needs `await`; local `inject` helper must call `app.inject` (recursion bug when replaceAll hit helper body).
- Backend style: Prettier run on all changed files; branch `developer`.

## Work State
### Completed
- **Search + filters workstream fully done and pushed** (superseded by auth): backend filters `q` (customers/motorcycles/orders) + `status` (motorcycles), orders `innerJoin` customers, zod schema on `fetch-motorcyles.ts`, 11 new e2e → 104 e2e/65 unit; `vitest.e2e.config.ts` testTimeout 15000. Commit `2b239ce` → `developer`. Frontend (branch `main`, commit `2ee7b86`): `use-debounced-value.ts` + `SearchInput`, services `q`/`status`, query-key builders, URL-synced search with 400ms debounce, server-side status filter for motocicletas, command-menu fixed, tsc/biome/build clean.
- **JWT auth (this workstream)**: users schema + migration, repos, AuthenticateUseCase + unit tests, @fastify/jwt registration, guard hook, login controller/routes, error mappings, 8 new e2e tests, all 20 existing e2e files converted to authed agents, seed admin, 112 e2e + 68 unit green, Prettier, commit `26ef32e` pushed to `developer`.

### Active
- (none — workstream complete)

### Blocked
- (none)

## Next Move
- Optional follow-ups (unrequested): frontend login screen wiring to `POST /api/auth/login` + token storage/send on `main`; apply `JWT_SECRET`/admin user to production env (`.env` already has secret); the pre-existing backend tsc errors could be cleaned up in a separate pass.

## Relevant Files
- `src/db/schema.ts` (users table), `src/db/seed.ts` (admin seed), `src/env/index.ts` + `src/test/setup/env.ts` (JWT_SECRET).
- `src/app.ts` (jwt register + error mappings), `src/http/controllers/index.routes.ts` (guard + authRoutes).
- `src/http/controllers/auth/` (login.ts, routes.ts, login.test.ts, guard.test.ts).
- `src/repositories/{users-repository.ts, drizzle/drizzle-users-repository.ts, in-memory/in-memory-users-repository.ts}`.
- `src/use-cases/authenticate.ts` + `factories/make-authenticate-use-case.ts` + `authenticate.test.ts` + `errors/{unauthorized,invalid-credentials}-error.ts`.
- `src/utils/test/{create-user.ts, authed-agent.ts}`.
- `drizzle/20260923151246_familiar_infant_terrible/` (users migration).