# Architecture Overview

- Pattern: Modular monorepo with `client/` (Vite + React) and `server/` (Express + TypeScript).
- Authentication: JWT access + refresh token pattern.
- Database: MySQL with migrations and Prisma ORM (planned).
- Deployment: Docker-compose for local, container registry + cloud for production.
