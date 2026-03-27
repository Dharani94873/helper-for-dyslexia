# Deployment Guide: Accessibility Helper for Dyslexia

Complete step-by-step guide to deploy the application to production.

---

## Prerequisites

Before deploying, ensure you have:
- GitHub account (for code hosting and CI/CD)
- MongoDB Atlas account (for database)
- Render account (for backend hosting)
- Netlify account (for frontend hosting)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **M0 Free tier**
5. Select your preferred cloud provider and region
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 2: Configure Database Access

1. In the sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `dyslexia-admin`
5. Generate a strong password (save this!)
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Configure Network Access

1. In the sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. For production: Add specific IPs from Render (see Render dashboard)
5. Click **"Confirm"**

### Step 4: Get Connection String

1. Click **"Database"** in sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js**, **Version: 4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://dyslexia-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name: `mongodb+srv://dyslexia-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dyslexia-helper?retryWrites=true&w=majority`

---

## Part 2: Backend Deployment (Render)

### Step 1: Prepare Repository

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dyslexia-helper.git
   git push -u origin main
   ```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your repository: `dyslexia-helper`
5. Configure the service:

   **Basic Settings:**
   - Name: `dyslexia-helper-backend`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

6. Click **"Advanced"** and set:
   - **Auto-Deploy**: Yes

### Step 3: Configure Environment Variables

Click **"Environment"** and add these variables:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://dyslexia-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dyslexia-helper?retryWrites=true&w=majority
JWT_SECRET=YOUR_SUPER_SECRET_KEY_MIN_32_CHARS
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://your-app.netlify.app,https://dyslexia-helper.netlify.app
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:**
- Generate `JWT_SECRET` using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ALLOWED_ORIGINS` will be updated after deploying frontend

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, note your backend URL: `https://dyslexia-helper-backend.onrender.com`

### Step 5: Seed the Database

1. In Render dashboard, go to **"Shell"** tab
2. Run: `npm run seed`
3. This creates demo users:
   - Admin: `admin@example.com` / `Admin123!`
   - User: `user@example.com` / `User123!`

### Step 6: Test Backend

Visit: `https://dyslexia-helper-backend.onrender.com/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

---

## Part 3: Frontend Deployment (Netlify)

### Step 1: Update Frontend Configuration

1. Edit `frontend/js/config.js`:
   ```javascript
   const API_CONFIG = {
     BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
       ? 'http://localhost:5000'
       : 'https://dyslexia-helper-backend.onrender.com',
     // ... rest of config
   };
   ```

2. Commit and push:
   ```bash
   git add frontend/js/config.js
   git commit -m "Update API URL for production"
   git push
   ```

### Step 2: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: (leave empty)
   - **Publish directory**: `frontend`

6. Click **"Deploy site"**

### Step 3: Configure Custom Domain (Optional)

1. In Netlify, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

### Step 4: Get Frontend URL

Your site will be available at: `https://YOUR-SITE-NAME.netlify.app`

### Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Edit environment variable `ALLOWED_ORIGINS`:
   ```
   https://YOUR-SITE-NAME.netlify.app
   ```
3. Service will auto-redeploy

---

## Part 4: GitHub Actions CI/CD Setup

### Step 1: Add Secrets to GitHub

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **"New repository secret"** for each:

   - `RENDER_DEPLOY_HOOK_URL`:
     - In Render: Settings → Deploy Hook
     - Copy the webhook URL

   - `NETLIFY_AUTH_TOKEN`:
     - In Netlify: User Settings → Applications → Personal access tokens
     - Create new token

   - `NETLIFY_SITE_ID`:
     - In Netlify: Site settings → General → Site information → Site ID

### Step 2: Enable GitHub Actions

The workflow file is already created at `.github/workflows/ci.yml`.

On every push to `main`, it will:
1. Run backend tests
2. Validate frontend HTML
3. Build Docker image
4. Deploy to Render
5. Deploy to Netlify

---

## Part 5: Alternative Deployment Options

### Option A: Heroku (Backend)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create dyslexia-helper-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-connection-string
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# Seed database
heroku run npm run seed
```

### Option B: Railway (Backend)

1. Go to [Railway](https://railway.app/)
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js
5. Add environment variables in dashboard
6. Deploy automatically

### Option C: GitHub Pages (Frontend)

1. In repository settings → Pages
2. Source: Deploy from branch
3. Branch: `main`, Folder: `/frontend`
4. Update `config.js` with your backend URL

### Option D: Docker Compose (Self-hosted)

```bash
# On your server
git clone your-repo
cd dyslexia-helper

# Create .env file in backend/
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Start services
docker-compose up -d

# Seed database
docker-compose exec backend npm run seed
```

---

## Part 6: Post-Deployment Verification

### Test Checklist

- [ ] Visit frontend URL
- [ ] Click "Login" and use demo credentials
- [ ] Upload a text file
- [ ] Upload a PDF file
- [ ] Paste text
- [ ] Apply formatting (font, size, spacing)
- [ ] Test color overlays
- [ ] Test syllable splitting
- [ ] Test text-to-speech
- [ ] Save preferences
- [ ] Test distraction-free mode
- [ ] Logout and login again
- [ ] Visit dashboard and see documents
- [ ] Delete a document
- [ ] (Admin only) Visit `/admin.html` and view analytics

### Monitor Logs

**Render:**
- Dashboard → Logs tab

**Netlify:**
- Site overview → Functions & Deploys

**MongoDB Atlas:**
- Metrics → View cluster metrics

---

## Troubleshooting

### CORS Errors

**Symptom:** Console shows CORS policy errors

**Solution:**
1. Check `ALLOWED_ORIGINS` in Render includes exact frontend URL
2. Ensure no trailing slashes in URLs
3. Redeploy backend after changing

### Database Connection Failed

**Symptom:** Backend logs show MongoDB connection error

**Solution:**
1. Check MongoDB Atlas network access (allow 0.0.0.0/0 or Render IPs)
2. Verify connection string password is correct
3. Ensure database user has read/write privileges

### File Upload Not Working

**Symptom:** "File upload failed" error

**Solution:**
1. Check `MAX_FILE_SIZE` environment variable
2. Verify `uploads` directory exists (created automatically)
3. Check Render service has write permissions

### TTS Not Working

**Symptom:** Text-to-speech doesn't play

**Solution:**
- TTS requires HTTPS in production (Netlify provides this)
- Some browsers don't support Web Speech API (check caniuse.com)
- User must interact with page before TTS can start (browser policy)

---

## Scaling Considerations

### When to Upgrade

**MongoDB Atlas:**
- M0 Free: 512MB storage, shared CPU
- Upgrade to M10 when: >100 active users or >500MB data

**Render:**
- Free tier: Limited hours, auto-sleep
- Upgrade to paid tier when: >1000 requests/day or need 24/7 uptime

### Performance Optimization

1. **Enable caching:**
   ```javascript
   // Add to backend/server.js
   const cache = require('express-cache-middleware');
   ```

2. **Add CDN for frontend:**
   - Netlify Pro includes CDN automatically

3. **Database indexing:**
   - Already configured in models

---

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB user has minimum required privileges
- [ ] ALLOWED_ORIGINS is restrictive (no wildcards)
- [ ] Rate limiting is enabled
- [ ] File upload size limits are set
- [ ] All passwords are hashed (bcrypt)
- [ ] HTTPS is enabled (automatic on Render/Netlify)
- [ ] Sensitive data not logged
- [ ] Dependencies are up to date

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check application logs for errors
- Monitor MongoDB storage usage

**Monthly:**
- Update npm dependencies: `npm audit fix`
- Review and rotate JWT_SECRET if needed
- Check for security updates

**Quarterly:**
- Review analytics and user feedback
- Performance optimization
- Backup MongoDB data (MongoDB Atlas has automatic backups)

---

## Support

For deployment issues:
- Render: https://render.com/docs
- Netlify: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**Congratulations! Your application is now live! 🎉**
