# PetShop

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## JWT Authentication (Spring Boot backend)

Backend:
- Base URL: `http://localhost:8090`
- Public endpoints:
  - `POST /users/register` — body: `{ "username": string, "email": string|null, "password": string }` — returns plain text
  - `POST /users/login` — body: `{ "username": string, "password": string }` — returns JWT as plain text
- Protected endpoints: any path under `/api/**` requires `Authorization: Bearer <token>`
- CORS allows `http://localhost:4200`.

### Configure API base URL
Edit `src/environments/environment.ts` and set:
```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8090'
};
```

### Run
```bash
npm install
npm start
```
App: `http://localhost:4200`

### Test the flow
1. Go to `/signup`, fill username, optional email, password → submit.
2. On success you will be redirected to `/login`.
3. Log in. The JWT (plain text) is saved to `localStorage` under `auth_token` and you are redirected to `/protected`.
4. On `/protected`, click "Call API" to GET `${API_BASE}/api/products`. The interceptor attaches `Authorization: Bearer <token>` for URLs starting with `${API_BASE}/api/`.
5. On 401/403, the app clears the token and redirects to `/login` (no refresh flow).

Locations:
- Interceptor: `src/app/core/interceptors/auth.interceptor.ts`
- Guard: `src/app/core/guards/auth.guard.ts`
- Auth service: `src/app/core/services/auth.service.ts`
- Pages: `src/app/features/auth/`
- Demo protected page: `src/app/features/protected/`
