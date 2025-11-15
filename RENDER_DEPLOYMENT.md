# Deploying MechaBot to Render with Docker

This guide explains how to deploy your MechaBot application to Render using Docker.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub (Render integrates with GitHub)
3. **Git Setup**: Ensure your local repository is committed and pushed

## Deployment Steps

### Step 1: Prepare Your Repository

Ensure your repository is pushed to GitHub:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

The repository should contain:
- `index.html`
- `styles.css`
- `script.js`
- `Dockerfile`
- `render.yaml`
- `.dockerignore`

### Step 2: Connect to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** and select **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Connect your GitHub account if not already connected
5. Select the `Mechabot` repository

### Step 3: Configure the Service

Fill in the deployment settings:

| Field | Value |
|-------|-------|
| **Name** | `mechabot` (or your preferred name) |
| **Environment** | `Docker` |
| **Region** | `Oregon` (or closest to you) |
| **Branch** | `main` |
| **Build Command** | Leave empty (Docker builds from Dockerfile) |
| **Start Command** | Leave empty (defined in Dockerfile) |

### Step 4: Verify render.yaml

The `render.yaml` file in your repository should be auto-detected. It specifies:
- Service type: Web
- Docker environment
- Port: 80 (exposed by your Dockerfile)
- Health check path: `/`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Build the Docker image
   - Start the container
   - Assign you a public URL

3. Wait for the deployment to complete (typically 2-5 minutes)
4. Your app will be available at: `https://mechabot-XXXXX.onrender.com`

## Post-Deployment

### Access Your Application

Once deployed, your MechaBot will be live at the provided Render URL. You can:
- Share the URL with others
- Monitor logs in the Render dashboard
- View deployment history and rebuild

### View Logs

In the Render dashboard:
1. Click on your service
2. Go to **"Logs"** tab
3. View real-time logs and past deployment logs

### Redeploy

To redeploy after making changes:

```bash
git add .
git commit -m "Update MechaBot"
git push origin main
```

Render will automatically redeploy when you push to your GitHub repository (if auto-deploy is enabled).

Or manually:
1. Go to your service in the Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Environment Variables

If you need to add API keys or other secrets:

1. In the Render dashboard, go to your service
2. Click **"Environment"**
3. Add new variables:
   ```
   API_KEY=your_actual_key_here
   ```

4. Update your `script.js` to use environment variables (requires a backend proxy for security)

## Dockerfile Details

Your current `Dockerfile`:
- Uses `nginx:alpine` as the base (lightweight)
- Copies static files to `/usr/share/nginx/html/`
- Configures Nginx to serve the app with SPA routing
- Exposes port 80

This is compatible with Render's Docker environment.

## Pricing

- **Free Tier**: Limited resources, may sleep after inactivity
- **Paid Tiers**: Continuous running, more resources

Check [render.com/pricing](https://render.com/pricing) for details.

## Troubleshooting

### Service fails to deploy

- Check logs in the Render dashboard for error messages
- Verify `Dockerfile` builds locally: `docker build -t mechabot .`
- Ensure all required files are in the repository

### Port binding issues

- Your Dockerfile exposes port 80
- Render automatically handles port binding
- You don't need to specify ports in `render.yaml` unless customizing

### CORS or API errors

- If calling external APIs, ensure your API keys are set as environment variables
- Consider using a backend proxy for security

## Support

For more info on Render Docker deployments, see:
- [Render Docker Guide](https://render.com/docs/docker)
- [Render Web Services](https://render.com/docs/web-services)
