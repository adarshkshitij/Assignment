# Design Notes

This document explains the intent behind the implementation choices so that the repository reads as deliberate engineering work rather than just a collection of working files.

## Project Intent

The goal was not only to build a working task manager, but to present the solution in a way that shows:

- backend architectural discipline
- clear request boundaries
- thoughtful auth and access control
- reviewer-friendly setup and documentation
- practical trade-offs appropriate to the scope

## Why Backend-First Full Stack

The assignment naturally leans backend, so the repository is optimized to surface backend depth first:

- route/controller/middleware/model separation
- validation strategy
- auth and RBAC
- API ergonomics
- operational clarity

The frontend is included to make the backend feel tangible, not to compete for architectural focus.

## Design Principles Used

### 1. Clarity over abstraction

The code favors obvious boundaries over extra layers. There is no unnecessary service/repository indirection for a project of this size.

### 2. Practical security baseline

- passwords are hashed
- protected routes require JWTs
- admin access is explicit
- user-owned resources are enforced

### 3. Reusable policy boundaries

Validation, authorization, and error handling live in middleware so controllers stay focused on domain behavior.

### 4. Reviewer ergonomics matter

Swagger, Postman, a health endpoint, CI, and supporting docs all reduce review friction and make the project easier to trust quickly.

## Notable Trade-Offs

### Token storage

The frontend uses browser-managed token storage because it keeps the demo simple. For a more production-grade version, `httpOnly` cookies would be the better next step.

### In-memory MongoDB fallback

This improves local resilience for reviewers. It is intentionally positioned as a convenience for development, not as a production persistence strategy.

### Limited test automation

The repository currently emphasizes build and verification signals over a full automated test suite. That is an area with clear room for growth and one of the most obvious next investments.

## Why This Structure Works Well

The current structure is a strong middle ground:

- easier to review than a distributed system
- more maintainable than a flat prototype
- realistic enough to show production-style thinking
- small enough to run quickly in an interview setting

## If Extended Further

The next meaningful upgrades would be:

- integration tests for auth and task flows
- stronger deployment story
- production-grade auth hardening
- improved observability
- distributed cache if horizontal scaling became necessary

