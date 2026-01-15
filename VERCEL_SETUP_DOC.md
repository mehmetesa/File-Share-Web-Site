# Vercel Configuration Guide

To make the file upload work on Vercel, you need to set up **Vercel Blob**.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Create a new project and import your GitHub repository (`File-Share-Web-Site`).
3. Once deployed (it might fail initially or work but uploads won't work), go to the **Storage** tab in your project dashboard.
4. Click **Connect Database** -> **Create New** -> **Blob**.
5. Give it a name (e.g., `store`) and click **Create**.
6. This will automatically add the `BLOB_READ_WRITE_TOKEN` to your project's Environment Variables.
7. **Redeploy** your application (Go to Deployments -> Redeploy) for the changes to take effect.
