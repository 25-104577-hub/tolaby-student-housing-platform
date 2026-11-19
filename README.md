# Tolaby | Student Housing Platform

Tolaby is a student-built full-stack web application prototype for student housing in Egypt. It connects students with housing listings and demonstrates core listing, booking, messaging, and administration flows.

## Technology

- Next.js 14 App Router, React, and TypeScript
- Tailwind CSS
- Prisma ORM and PostgreSQL
- JWT-based authentication with HTTP-only cookies

## Implemented prototype flows

- Account registration and login
- Property listing, search, filters, and detail pages
- Student, owner, and admin overview pages
- Booking and visit request APIs
- Messaging API and moderation helpers
- Configurable platform fee logic
- Payment-provider abstraction with a mock provider

## Run locally

1. Install dependencies with npm install.
2. Copy .env.example to .env and set local PostgreSQL connection values and a strong JWT_SECRET.
3. Run npm run prisma:generate and npm run db:push.
4. Optionally run npm run prisma:seed to create sample data.
5. Start the app with npm run dev.

The seed script creates demo accounts with a fixed sample password for local development. Use only a disposable local database for seeded demo accounts. Do not deploy the demo credentials or the development JWT fallback to a public environment.

## Prototype scope and limitations

The payment interface currently uses a mock provider; real payment processing is not implemented. Real-time chat, file uploads, rate limiting, CSRF protection, and production deployment hardening are also not complete. The app is a learning portfolio project and is not ready for production use.
