# thanperfect – Confirmed Development Direction

This document summarizes the agreed-upon technical and procedural direction for the `thanperfect` minimal SSO project.

---

## 🧭 Project Overview

- **Project Name:** thanperfect
- **Purpose:** Lightweight SSO system using a simple, free-form identifier (e.g., ".", "❤️")
- **Platform:** Hosted on [Vercel](https://vercel.com/narimato/thanperfect)
- **Repository:** [GitHub Repository](https://github.com/moldovancsaba/thanperfect.git)
- **Database:** MongoDB Atlas

---

## ✅ Finalized Development Rules

| Area                      | Specification |
|---------------------------|---------------|
| 🧱 **Framework**          | Next.js (JavaScript only) |
| ⚠️ **Linting**           | **No ESLint** or similar tools allowed |
| 🔐 **Admin Access**       | No authentication – `/admin` is a public route |
| 🧪 **Session Token**      | Valid for 10 minutes; no auto-extension |
| 🔁 **Session Reuse**      | Token can be reissued by submitting the same identifier |
| 🌐 **SSO Method**         | URL-based integration with external apps |
| 🛠️ **Testing**           | Allowed if it’s minimal and easy to maintain |
| 📦 **Package Manager**   | npm (strict requirement) |
| 📝 **Versioning**         | Every stable version must have:
  - Unique version tag (e.g., `v0.1.0`)
  - Detailed changelog
  - Clearly documented rollback point |

---

## 📌 Design Philosophy

- **No external identity providers** (e.g., Auth0, OAuth, JWT)
- **No personal data** (e.g., email, name, password, IP)
- Fully compliant with privacy-focused minimal systems
- Designed to serve as a **plug-and-play SSO** for other apps

---

## 🔜 What Comes Next

- Generate project files:
  - Backend logic (models, lib, API routes)
  - Frontend pages
  - Deployment configs
- Prepare `.env.local` and README setup instructions
- First release: `v0.1.0`

