# Contributing

This project is primarily maintained as a portfolio and review repository, but contributions that improve clarity, correctness, or reviewer experience are welcome.

## Local Setup

1. Clone the repository.
2. Configure `backend/.env` from [backend/.env.example](./backend/.env.example).
3. Start MongoDB locally or with Docker.
4. Run backend and frontend locally.

## Before Opening A Pull Request

Please verify:

```bash
cd backend
npm run check
```

```bash
cd frontend
npm run build
```

## Contribution Priorities

High-value contributions include:

- backend integration tests
- frontend interaction tests
- deployment improvements
- documentation clarity
- accessibility and UX refinements

## Style Expectations

- keep changes small and focused
- prefer clarity over abstraction
- update documentation when behavior changes
- do not commit secrets or local-only environment files

