# Catalyst Slate Deployment Preparation Report

This document details the compatibility, configuration, setup, and deployment workflow for migrating the KSP AI Investigation Copilot frontend to **Zoho Catalyst Slate**.

---

## 1. Slate Compatibility Report

### Frontend Framework Compatibility
- **Next.js Version**: Next.js 16.2.10 (Turbopack)
- **Node.js Environment**: Compatible with Node.js 18.x / 20.x / 22.x.
- **Compatibility Status**: **Fully Compatible**. Next.js 16 is fully supported by the Catalyst Pipelines build runner.

### Build and Hosting Compatibility
- **Build Mode**: Static Site Generation (SSG) / Static Export (`output: "export"`).
- **Justification**: Zoho Catalyst Slate is a CDN-distributed static hosting platform. Next.js server-side rendering (SSR) is not natively supported by Slate. 
- **Current Configuration**:
  - `frontend/next.config.ts` has `output: "export"` enabled (Success ✅).
  - `frontend/next.config.ts` has `images.unoptimized: true` configured (Success ✅). This is required because Next.js's dynamic image optimization relies on a running Node server, which is absent in static hosting.
- **Routing**: Next.js file-system routing compiles into clean static HTML structure (e.g. `/dashboard.html` or `/dashboard/index.html`). Slate handles these static endpoints out of the box.

---

## 2. Required Configuration Files

We have prepared the following configuration files in the project workspace:

### 1. `catalyst.json` (Root)
Tracks the project targets and configures the `frontend` folder as the source directory for the `slate` component.
```json
{
  "project": {
    "name": "Project-Rainfall",
    "id": "54539000000013024"
  },
  "functions": {
    "source": "functions",
    "targets": [
      "ksp_investigation_copilot"
    ]
  },
  "slate": {
    "source": "frontend"
  }
}
```

### 2. `frontend/cli-config.json` (Frontend Directory)
Configures the local dev command, mapping the Next.js port to the environment port dynamically allocated by the Catalyst CLI.
```json
{
  "dev_command": "npm run dev -- --port $ZC_SLATE_PORT"
}
```

---

## 3. GitHub Deployment Instructions

Zoho Catalyst Slate provides native, zero-friction GitHub Integration. This connects your repository directly to the Catalyst build pipeline (Catalyst Pipelines) so that pushing to a branch automatically triggers a build and deploy.

### Setup Git Connection:
1. Push this prepared repository to your GitHub account (e.g. `https://github.com/your-username/datathon`).
2. Do **NOT** create a custom `.github/workflows/` deployment file. Catalyst Slate manages the build on its own servers via webhooks and does not require GitHub Actions runner minutes.

---

## 4. Catalyst Console Setup Instructions

Follow these steps in the Zoho Catalyst Console to link and deploy your application:

1. **Open Catalyst Console**: Navigate to the [Zoho Catalyst Console](https://console.catalyst.zoho.com).
2. **Access Slate**: In the left sidebar, click on **Hosting** and select **Slate**.
3. **Connect Repository**:
   - Click **Connect GitHub** and authorize Zoho Catalyst to access your repository.
   - Choose your repository (`datathon`) and the target branch (e.g., `main` or `release`).
4. **Configure Build Settings**:
   - Slate will auto-detect the framework as **Next.js**.
   - Ensure the following parameters match:
     - **Framework**: `Next.js`
     - **Source Directory**: `frontend`
     - **Install Command**: `npm install`
     - **Build Command**: `npm run build`
     - **Build Output Path**: `out` (relative to `frontend/`)
5. **Save and Deploy**: Click **Deploy**. Catalyst will run the pipeline, build the Next.js static files, and host them.

---

## 5. Environment Variable Checklist

Because the frontend is a statically exported Next.js app, environment variables must be compiled and inlined during build time. You must add these variables in the Catalyst Console **before** triggering the deployment build:

| Variable Name | Required Value / Purpose |
|---|---|
| `NEXT_PUBLIC_CATALYST_PROJECT_ID` | The production Zoho Catalyst Project ID (e.g. `54539000000013024`) |
| `NEXT_PUBLIC_CATALYST_CLIENT_ID` | The production Catalyst OAuth Client ID |
| `NEXT_PUBLIC_CATALYST_AUTH_DOMAIN` | The production Catalyst Auth Domain |
| `CATALYST_PROJECT_KEY` | Server-side project key for backend functions (if utilized) |
| `CATALYST_ENVIRONMENT` | Set to `production` for release builds |

> [!IMPORTANT]
> Since the build runs on Catalyst Pipelines, these variables must be configured under **Slate Environment Variables** in the console so they are available to Next.js during the build phase.

---

## 6. Production Readiness Checklist

Before moving to the console and deploying, verify that the following tasks are completed:

- [x] All Next.js source code has been moved to the `frontend/` directory.
- [x] Root-level commands (`npm run dev`, `npm run build`, `npm run lint`) delegate to the `frontend/` folder.
- [x] All obsolete configurations and assets (AppSail `app-config.json`, client hosting `client/` folder) have been deleted.
- [x] `catalyst.json` is updated with the `slate` target configuration pointing to `frontend`.
- [x] `frontend/cli-config.json` is present with the correct local development port mapping.
- [x] `npm install` runs successfully at the root level.
- [x] `npm run build` succeeds at the root level, generating a static build in `frontend/out/`.
- [x] `npm run lint` completes with **zero errors or broken imports**.

---

## 7. Blockers & Outstanding Items

### Critical Verification Findings

We have verified the Slate CLI behavior using local Catalyst CLI version `1.27.0`. Please note the following findings:

1. **Required Console Initialization**:
   - Running `catalyst slate:link` or `catalyst slate:create` on a project that does not have Slate initialized/enabled in the Catalyst Console throws a CLI crash: `TypeError: existingSlates.findIndex is not a function`.
   - **Resolution**: You **must** create the Slate application in the Catalyst Console UI first. Once the service is active on the backend, the CLI commands will execute correctly without throwing the array type error.

2. **cli-config.json Local Port Mapping**:
   - The `dev_command` using `npm run dev -- --port $ZC_SLATE_PORT` is confirmed. The Catalyst CLI dynamically allocates a local port for serving and automatically replaces the `$ZC_SLATE_PORT` placeholder in the command string before running it.

3. **Deployment Workflow**:
   - The GitHub deployment flow is fully managed and automated. Once linked in the Console, pushing changes to the target branch triggers Catalyst Pipelines to build and deploy. The local CLI is only required for local dev serving (`catalyst serve`) or manual overrides.

### Outstanding Steps
- [ ] Initialize/Create the Slate application in the Catalyst Console UI under **Hosting -> Slate**.
- [ ] Connect the GitHub repository in the Catalyst Console.
- [ ] Add the environment variables under **Slate Environment Variables** in the console.
