# 17 — Coding Rules & Conventions

## 1. Repository layout

The project is a monorepo with two siblings:

```
/
├── frontend/    # Next.js 15
├── backend/     # FastAPI
├── docs/        # this folder
├── .gitignore
├── .editorconfig
└── README.md    # tiny overview pointing at docs/
```

We do not use a workspace manager; each project has its own lockfile.

## 2. Git workflow

- Default branch: `main`.
- Feature branches: `feat/<scope>-<short-desc>`.
- Commit style: **Conventional Commits**. Examples:
  - `feat(pdp): add sticky bottom CTA for mobile`
  - `fix(cart): prevent duplicate offer line`
  - `chore(deps): pin tailwind v4`
- PRs not required for v1 (founder + AI coder), but every push to `main` must build & pass lint.

## 3. TypeScript rules (frontend)

`tsconfig.json` (strict):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

### Style

- No `any`. Use `unknown` and narrow.
- No `// @ts-ignore` (`// @ts-expect-error` allowed only with a clear note).
- Components: PascalCase. Hooks: camelCase with `use` prefix. Files in `components/` match the component's name.
- Default exports only for `app/**/page.tsx` and `app/**/layout.tsx`. Everywhere else: **named exports**.
- One component per file (unless small co-located helpers).
- Props types live next to the component as `type Props = …`.
- Server vs client: every client component starts with `'use client'`. Server is default.
- All data fetches happen in server components (or RSC server actions). The frontend's `app/api/*` routes are pure proxies, no business logic.

### ESLint (flat config) + Prettier

`eslint.config.mjs`:

```js
import next from 'eslint-config-next';
import tw from 'eslint-plugin-tailwindcss';

export default [
  ...next(),
  { plugins: { tailwindcss: tw },
    rules: {
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/no-custom-classname': 'off',
      'no-restricted-imports': ['error', {
        patterns: [{ group: ['lodash/*'], message: 'Use native ES utilities.' }]
      }],
      'react/jsx-key': 'error'
    }
  }
];
```

`prettier.config.mjs`:

```js
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss']
};
```

## 4. Python rules (backend)

`pyproject.toml`:

```toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = ["E","F","W","I","B","UP","SIM","TID","ASYNC","RUF"]
ignore = ["E501"]    # let black/ruff-format own line length

[tool.ruff.lint.isort]
known-first-party = ["app"]

[tool.black]
line-length = 100
target-version = ["py312"]

[tool.mypy]
python_version = "3.12"
strict = true
disallow_untyped_decorators = false
plugins = ["pydantic.mypy"]
```

### Style

- All public functions/methods are type-annotated.
- All modules `from __future__ import annotations` allowed (for forward refs in models).
- No `print()` — use `structlog.get_logger()`.
- No top-level side effects in modules except `app/main.py`.
- Async first. Use `async def` for any endpoint or service touching IO. Sync helpers permitted (pure functions only).
- Tests in `tests/` mirror the package structure (`tests/services/test_orders.py`).

### Logging

- INFO for business events. WARNING for retries. ERROR for unrecoverable.
- Never log raw `phone`, `full_name`. Use `phone_e164[:5]+"***"`.

### Naming

- Modules `snake_case.py`. Classes `PascalCase`. Functions `snake_case`. Constants `UPPER_SNAKE`.
- Pydantic schemas suffixed: `OrderCreateIn`, `OrderOut`.

## 5. Commit hygiene

- Commits are atomic. Don't mix a refactor with a feature.
- Every commit message starts with the conventional prefix.
- The body explains *why* when the diff isn't self-explanatory.
- No `wip` commits to `main`.

## 6. Pre-commit (optional but recommended)

`.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.8
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.11.2
    hooks:
      - id: mypy
        additional_dependencies: [pydantic==2.9.*]
        files: ^backend/
  - repo: local
    hooks:
      - id: frontend-lint
        name: frontend-lint
        entry: bash -c 'cd frontend && npm run lint --silent'
        language: system
        pass_filenames: false
        files: ^frontend/
```

## 7. CI (optional — minimal recommendation)

If GitHub Actions is enabled, two jobs:

1. `frontend`: `npm ci && npm run lint && npm run typecheck && npm run build`.
2. `backend`: `pip install -r requirements.txt && ruff check . && mypy app && pytest -q`.

For v1 the founder may skip CI and rely on the AI coder's local checks.

## 8. Error handling style

- Frontend: never `try/catch` to swallow; either show a toast or rethrow.
- Backend: never bare `except`. Catch the narrowest exception. Re-raise unhandled.
- Validation errors → 422 with `fields`.
- Business errors → 4xx with `error.code` enum value.
- Server errors → 500, no stack trace in the response body.

## 9. Comments policy

Comments explain *why* (intent, trade-off, constraint), never *what*. Bad: `# increment counter`. Good: `# We deliberately count duplicate add-to-cart events as a single conversion intent — see 13-pixels-tracking-capi.md § Event timing.`

## 10. Performance rules

- Frontend: never render a list > 30 items without virtualization. (We don't have any in v1, but worth stating.)
- Backend: never `await` inside a tight loop when a `gather` would do.
- Backend: every external HTTP call has an explicit timeout (httpx default is none).

## 11. Security rules

- Never log raw PII.
- Never put a secret in the frontend bundle. Only `NEXT_PUBLIC_*` vars are public.
- Validate every input with Zod / Pydantic before use.
- Use parameterized SQL (SQLAlchemy ORM only — no raw SQL except in migrations).
- Use `secrets.compare_digest` for API key comparisons.

## 12. Files & artifacts to never commit

- `.env`, `.env.local`, anything not `.env.example`.
- Any keys / tokens.
- Real customer data, even for testing.
- `node_modules`, `.next`, `__pycache__`, `.venv`.

## 13. README

Each project (`frontend/`, `backend/`) has its own `README.md` with:

- One-paragraph overview.
- Setup commands.
- `npm run dev` / `uvicorn` quickstart.
- Pointer back to `docs/`.

## 14. Documentation

- If a behavior is documented in `docs/` and the code diverges, the **code is wrong**.
- If a doc is wrong, the AI coder proposes the doc patch in the same change, but never silently ships divergent code.

## 15. Code review priorities (for the AI coder reading their own diff)

1. Did I touch copy without consulting `04-copy-bank-arabic-ksa.md`?
2. Did I add a third-party dependency? Is it in `09 § 1`?
3. Did I break the alternating image rule?
4. Did I introduce PII logging?
5. Did I introduce an un-deferred third-party script?
6. Did I forget to set `event_id` consistently on pixel + CAPI?
