# Enterprise Node.js + Express API (JavaScript, Vercel Ready)

This is a production-ready, enterprise-grade boilerplate for a Node.js + Express backend. It is written in modern **JavaScript (ES Modules)**, follows a clean architecture, and is 100% optimized for **Vercel serverless deployment**.

## ✨ Features

- **Modern Stack:** Node.js (LTS), Express.js
- **Database:** MongoDB with Mongoose (optimized for serverless connections)
- **Authentication:** JWT + Secure Refresh Token rotation (stored in DB)
- **Architecture:** Modular, Clean Architecture (Controllers, Services, Models)
- **Validation:** `zod` for robust request validation
- **Security:** `helmet`, `cors`, `express-rate-limit`
- **Logging:** `winston` configured for JSON (serverless-friendly)
- **Deployment:** Vercel serverless (`vercel.json`)
- **Tooling:** ESLint (Airbnb), Prettier, Jest, Supertest
- **Type Safety:** Full JSDoc comments for developer ergonomics

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Vercel CLI](https://vercel.com/docs/cli) (globally installed: `npm i -g vercel`)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

### 2. Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
    Now, open `.env` and fill in the values:
    - `MONGODB_URI`: Your connection string from MongoDB Atlas.
    - `JWT_SECRET`: A long, random string (e.g., from `openssl rand -base64 32`).
    - `JWT_REFRESH_SECRET`: Another long, random string.

### 3. Running Locally

This project has two local development modes.

#### Mode A: Local Server (Recommended for most dev)

This runs the app as a traditional Node.js server.

```bash
npm run dev
```

---

### 📦 Project Structure

```
.
├── .github/              # GitHub Actions CI/CD
├── src/
│   ├── api/              # API modules (routes, controllers, validation)
│   │   ├── auth/
│   │   ├── users/
│   │   └── products/
│   │   └── index.js      # Main v1 router
│   ├── config/           # Config files (db, logger, env loader)
│   ├── core/             # Core helpers (ApiError, ApiResponse, asyncHandler)
│   ├── middleware/       # Custom Express middleware (auth, error, validate)
│   ├── models/           # Mongoose models/schemas
│   ├── services/         # Business logic (e.g., auth.service.js)
│   ├── scripts/          # Utility scripts (e.g., seed.js)
│   ├── tests/            # Jest tests
│   ├── utils/            # Shared utilities
│   ├── app.js            # Core Express app setup (middleware, routes)
│   └── index.js          # LOCAL development server entry point
│
├── vercel/
│   └── index.js          # VERCEL serverless function entry point
│
├── .env.example          # Environment variable template
├── .eslintrc.cjs         # ESLint config
├── .gitignore
├── jest.config.cjs       # Jest config
├── package.json          # Project dependencies and scripts
├── README.md             # This file
└── vercel.json           # Vercel deployment configuration
```

---

## Vercel Environment Variables (Set in Vercel UI):

[ ] NODE_ENV: production

[ ] MONGODB_URI: (Your Atlas connection string)

[ ] JWT_SECRET: (Your production secret)

[ ] JWT_EXPIRES_IN: 15m

[ ] JWT_REFRESH_SECRET: (Your production refresh secret)

[ ] JWT_REFRESH_EXPIRES_IN: 7d

[ ] CORS_ORIGIN: (Your frontend URL, e.g., https://my-app.vercel.app)

[ ] LOG_LEVEL: info
