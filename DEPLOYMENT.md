# Deployment Guide

## Deploy Backend to Render

### Steps:
1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (partyverse)
4. Select the repository
5. Configure the service:
   - **Name**: partyverse-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
7. Click "Create Web Service"

Once deployed, you'll get a URL like: `https://partyverse-backend.onrender.com`

### Update Frontend:
After getting your backend URL, update the `getApiBase()` function in `src/stores/userStore.ts`:

```typescript
return 'https://partyverse-backend.onrender.com'; // Replace with your actual URL
```

### Update Backend CORS:
Add your new backend domain to the CORS origins in `server.js`:

```javascript
origin: [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
  'https://partyverse-murex.vercel.app',
  'https://your-backend-domain.onrender.com' // Add your deployed backend domain
]
```

## Alternative: Deploy to Other Platforms

### Heroku (Free tier recently ended, but Heroku still works with paid plans)
- Push to Heroku: `git push heroku main`
- Set environment variables via Heroku dashboard

### Railway.app
- Connect GitHub repository
- Set environment variables
- Deploy from `backend/` directory

### Vercel (For Backend)
- Create `backend/vercel.json` with serverless function configuration
- Deploy backend as API routes

## Local Testing
Make sure both servers are running:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```
