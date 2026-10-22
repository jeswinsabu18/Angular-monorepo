# Employee Management

This Nx workspace contains a standalone Angular employee-management application and focused Nx libraries under `packages/`. Application behavior and the Angular major version are preserved.

## Development server

Start the application with Nx:

```bash
npx nx serve employee-management
```

The app is available at `http://localhost:4200/`.

## Building

Build the application with its production configuration:

```bash
npx nx build employee-management
```

Use `--configuration=development` for a development build.

## Running unit tests

Run the Angular unit-test target through Nx:

```bash
npx nx test employee-management
```

There are currently no `*.spec.ts` files. The test target and spec TypeScript configuration are retained.

## Workspace projects

List the Nx projects with:

```bash
npx nx show projects
```

The application lives in `apps/employee-management`. Shared libraries are in `packages/shared/`:

- `models` — shared employee and table models
- `shared-ui` — reusable standalone controls and page shell

Feature and data-access libraries are grouped by domain:

- `packages/employee/data`, `feature-employees`, `feature-details`, and `feature-analytics`
- `packages/auth/data` and `feature-auth` (including authentication and admin guards)
- `packages/access-management/feature`
- `packages/settings/data-theme` and `feature-help`

The app owns its routes, shell, About page, global styles, public files, and assets. Employee seed JSON remains app-owned and is supplied to employee data access through an injection token. Nx module-boundary lint rules enforce the library dependency directions.

Run the workspace-wide checks with:

```bash
npx nx run-many -t build --all
npx nx run-many -t lint --all
npx nx run-many -t test --all
```

Libraries have Nx test targets, but the original workspace did not contain spec files, so the test command reports that no tests were found until tests are added.
