# Copilot Instructions

## Project shape
- Frontend lives in `frontend/` and is an Angular 17 standalone app bootstrapped from `src/main.ts` with `bootstrapApplication`.
- `src/app/app.routes.ts` is the root router. Feature areas are lazy loaded and each feature folder owns its own `*.routes.ts`.
- The current UI shell is `src/app/app.component.ts`; shared brand/navigation content comes from `src/app/core/site-data.ts`.
- The docs in `documentation/features/*.md` define the intended product shape: public landing, linktree, gallery, store, admin, then backend/API work.
- Backend work is planned separately as a .NET 10 Minimal API + PostgreSQL modular monolith organized by feature/vertical slice.

## Build, test, and run
- Dev server: `cd frontend && npm start`
- Production build: `cd frontend && npm run build`
- Unit tests: `cd frontend && npm test`
- Single spec: `cd frontend && npm test -- --include=src/app/app.component.spec.ts`

## Conventions
- Prefer standalone components and lazy-loaded route files (`loadComponent` for pages, `loadChildren` for feature route groups).
- Keep template-bound values in `protected readonly` fields and reuse `src/app/core/site-data.ts` for shared brand/nav/social data.
- Use Angular control flow (`@for`) and `NgOptimizedImage` where it fits.
- Keep the visual system consistent with `src/styles.scss`: dark, minimal, CSS-variable driven styling.
- New feature work should follow the documented split: landing/linktree remain static; gallery/store/admin should be feature-isolated and reusable where possible.
- Match the product copy and structure in the PRD: Rafael Xavier branding, social links, affiliate store, and a protected admin area.
