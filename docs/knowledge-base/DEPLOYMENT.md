# Karnataka State Police AI Investigation Copilot — Zoho Catalyst Deployment Playbook

This document outlines the required configuration, local validation, and deployment steps to host the KSP AI Investigation Copilot application on the Zoho Catalyst serverless cloud.

---

## 1. Prerequisites
To deploy this application, ensure the following dependencies are installed and available on your system:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **Zoho Catalyst CLI** (install globally via `npm install -g zcatalyst-cli`)

---

## 2. Configuration Settings

### Catalyst Project Configuration (`catalyst.json`)
The application is preconfigured for Catalyst Client Hosting. The project schema is managed via the `catalyst.json` file in the root directory:
```json
{
  "project": {
    "name": "KSP_Investigation_Copilot",
    "id": "YOUR_CATALYST_PROJECT_ID"
  },
  "client": {
    "source": "out"
  }
}
```
> [!NOTE]
> During final deployment, replace `YOUR_CATALYST_PROJECT_ID` with the official project ID obtained from your Zoho Catalyst Console.

### Required Environment Variables (`.env.local`)
Create a `.env.local` file in the project root to set the runtime parameters:
```bash
# Public Zoho Catalyst Credentials
NEXT_PUBLIC_CATALYST_PROJECT_ID="YOUR_CATALYST_PROJECT_ID"

# Zoho Catalyst API endpoints and client settings
# When NEXT_PUBLIC_CATALYST_PROJECT_ID matches a valid ID, the application
# swaps from Local mock fallbacks to active Catalyst Web SDK pipelines automatically.
```

---

## 3. Production Build & Compilation

To compile and optimize the Next.js frontend into static assets for Catalyst deployment, execute:
```bash
# Clean previous builds and run Next.js compilation
npm run build
```
This script leverages the Next.js static HTML export mechanism (configured via `output: "export"` in `next.config.ts`), creating a standalone, serverless bundle inside the `out/` directory.

---

## 4. Local Simulation & Verification

Verify the compiled assets locally using the Catalyst CLI simulator before initiating cloud uploads:
```bash
# Start the Zoho Catalyst local emulator
catalyst serve
```
This launches a local server (typically at `http://localhost:3000`) hosting the files inside the `out/` directory. Use this environment to perform end-to-end regression validation.

---

## 5. Deployment Commands

Once local simulation passes, perform the final deployment to the Zoho Catalyst production client cloud environment:

1. **Log in to Zoho Catalyst**:
   ```bash
   catalyst login
   ```
   Follow the CLI prompts to authenticate using your Zoho credentials.

2. **Select Target Project**:
   ```bash
   catalyst use
   ```
   Select the `KSP_Investigation_Copilot` project or register a new one.

3. **Deploy Assets**:
   ```bash
   catalyst deploy
   ```
   This uploads all compiled HTML, CSS, JavaScript, and asset files from the `out/` directory to Zoho Catalyst Client Hosting. Once completed, the CLI will output the public URL of the investigation copilot console.
