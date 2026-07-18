# Zoho Catalyst Authentication Setup Guide
## KSP AI Investigation Copilot

This guide outlines the steps to register your Zoho Catalyst application credentials and enable Hosted Authentication.

---

## 1. Credentials Configuration

To wire the application with your Zoho Catalyst account, obtain the credentials from the Catalyst Console and populate `.env.local` in your project root:

```env
NEXT_PUBLIC_CATALYST_PROJECT_ID="your_catalyst_project_id"
NEXT_PUBLIC_CATALYST_CLIENT_ID="your_catalyst_client_id"
NEXT_PUBLIC_CATALYST_AUTH_DOMAIN="your_catalyst_auth_domain"
```

### Where to Find the Credentials in the Catalyst Console

1. **Project ID**:
   - Open your project in the [Catalyst Console](https://console.catalyst.zoho.com).
   - The Project ID is displayed on the main project dashboard and in the browser URL (e.g. `https://console.catalyst.zoho.com/projects/YOUR_PROJECT_ID`).

2. **Client ID & Auth Domain**:
   - Go to **Authentication** under the **Storage** section in the left panel.
   - Click on the **Web SDK** tab.
   - You will see the initialization snippet containing `client_id` and `auth_domain`. Copy those values into `.env.local`.

---

## 2. Enabling Hosted Authentication

1. In the **Authentication** section of the Catalyst Console, choose **Hosted Authentication** (if prompted to select between Hosted, Embedded, or Third-party).
2. Go to **Authentication Settings**:
   - Enable **User Sign-in**.
   - (Optional) Toggle off **User Sign-up** if you want case logins to be restricted to pre-registered officer KGIDs only.

---

## 3. Configuring Redirect & Callback URLs

Configure the navigation targets inside the **Authentication** settings to return the user to the application homepage after login or logout.

| Parameter | Recommended Value | Description |
|---|---|---|
| **Redirect URL** | `https://<your-app>.catalystserverless.in/` | The page Catalyst redirects to after successful login |
| **Logout Redirect URL** | `https://<your-app>.catalystserverless.in/` | The landing page after logging out |
| **Allowed Origins (CORS)** | `https://<your-app>.catalystserverless.in` | Enables the Web SDK to send secure cross-origin requests |

> **Local Development**: If testing the Catalyst connection locally, add `http://localhost:3000` to both **Redirect URL** and **Allowed Origins**.

---

## 4. Environment Fallbacks (Mock Mode)

To run the application entirely offline or test features without connecting to Catalyst services:
- Set `NEXT_PUBLIC_CATALYST_PROJECT_ID="mock_project_id"` in `.env.local`.
- The application will automatically bypass all Zoho Catalyst Web SDK scripts and load mock accounts using default credentials (`123456` or `999999` with password `password`).
