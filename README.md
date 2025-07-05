# ThanPerfect

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/thanperfect)

A privacy-first, ephemeral Single Sign-On (SSO) service that enables one-tap login with minimal metadata, full audit logging, and seamless cross-domain redirect SSO integration.

## Features

- 🔐 **UTF-8 Identifier Auth** - Use any UTF-8 string as your identifier
- 🪪 **Stateless Tokens** - 10-minute TTL with no refresh
- 🔁 **Cross-Domain SSO** - Seamless redirect-based authentication
- 🧾 **Full Audit Logging** - ISO 8601 compliant timestamped events
- 👨‍💼 **Admin Dashboard** - RBAC-controlled management interface

## Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Release Notes](./RELEASE_NOTES.md)
- [Development Tasks](./TASKLIST.md)
- [Project Roadmap](./ROADMAP.md)
- [Learning Notes](./LEARNINGS.md)
- [SSO Documentation](/docs/sso)
  - [Overview](/docs/sso/overview.md)
  - [Technical Specification](/docs/sso/technical-spec.md)
  - [Integration Guide](/docs/sso/integration-guide.md)
  - [API Reference](/docs/sso/api-reference.md)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
