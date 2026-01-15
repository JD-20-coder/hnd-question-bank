# 🚀 Push to GitHub & Deploy to Vercel

## ✅ Repository Initialized

Your project is now a **Git repository** with **118 files committed**. 

### Current Status:
```
✅ Git initialized
✅ .gitignore configured  
✅ Initial commit created
❌ Remote repository not yet connected
```

---

## 📍 STEP 1: Create GitHub Repository

### Method 1: Using GitHub Web (Easiest)

1. **Go to:** https://github.com/new
2. **Fill in:**
   - Repository name: `hnd-question-bank`
   - Description: "HND Question Bank Management System"
   - Visibility: **Public** (for free Vercel deployment)
   - **Do NOT** initialize with README, .gitignore, or license
3. **Click:** "Create repository"

### Method 2: Using GitHub CLI

```powershell
# Install GitHub CLI if needed
winget install GitHub.cli

# Create repo
gh repo create hnd-question-bank --public --source=. --remote=origin --push
```

---

## 📍 STEP 2: Push Code to GitHub

After creating your repository on GitHub, you'll see instructions like:

```powershell
# Navigate to project
cd "C:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hnd-question-bank.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/john-doe/hnd-question-bank.git
git branch -M main
git push -u origin main
```

---

## 📍 STEP 3: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/new
2. **Login** with GitHub (authorize Vercel)
3. **Select** your `hnd-question-bank` repository
4. **Click** "Import"
5. **Configure** environment variables (see below)
6. **Click** "Deploy"

### Environment Variables to Set in Vercel:

```
DB_HOST=your-mysql-host.com
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=hnd_question_bank
JWT_SECRET=your-random-secret-32-chars-min
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=30d
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-specific-password
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
SERVER_BASE_URL=https://your-vercel-domain.vercel.app/api
```

### Vercel Configuration File

The `vercel.json` in your project already contains:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "env": [
    "DB_HOST",
    "DB_PORT", 
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN"
  ],
  "functions": {
    "server/**/*.ts": {
      "runtime": "node18.x"
    }
  }
}
```

---

## 🗄️ Setup Database for Production

### Option A: Use a Cloud MySQL Service (Recommended)

**Popular Services:**
- **PlanetScale** (MySQL-compatible, free tier)
  - Go to: https://planetscale.com
  - Create account and database
  - Copy connection string
  - Use in Vercel env vars

- **ClearDB** (MySQL hosting)
  - Go to: https://www.cleardb.com
  - Deploy free MySQL database
  - Get credentials

- **AWS RDS** (Professional)
  - Go to: https://aws.amazon.com/rds
  - Create MySQL instance
  - More expensive but very reliable

### Option B: Self-Hosted MySQL

If you have a server with MySQL:
```
DB_HOST=your-server-ip-or-domain.com
DB_PORT=3306
DB_USER=prod_user
DB_PASSWORD=strong-password
```

Make sure:
- MySQL is accessible from the internet
- Port 3306 is open (or configured in firewall)
- Database and user are created

---

## 🔑 Environment Variables Reference

### Mandatory Variables
```
DB_HOST              → MySQL server address
DB_PORT              → MySQL port (usually 3306)
DB_USER              → MySQL username
DB_PASSWORD          → MySQL password
DB_NAME              → Database name (hnd_question_bank)
JWT_SECRET           → Random string for token signing
NODE_ENV             → Set to "production"
```

### Optional Variables
```
MAIL_USER            → Email for notifications
MAIL_PASS            → Email password/app token
JWT_EXPIRES_IN       → Token expiry (default: 24h)
REFRESH_TOKEN_EXPIRES_IN → Refresh token expiry (default: 30d)
FRONTEND_URL         → Frontend domain
SERVER_BASE_URL      → Backend API domain
```

---

## 📋 Complete Deployment Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub (`git push -u origin main`)
- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Environment variables set in Vercel
- [ ] Database created (PlanetScale or other service)
- [ ] Database credentials verified working
- [ ] Deployment triggered and completed
- [ ] Test application at https://your-domain.vercel.app
- [ ] Create test account
- [ ] Upload test question bank
- [ ] Verify public browsing works

---

## 🚀 Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Create GitHub repo | 2 min | |
| Push code to GitHub | 2 min | |
| Setup database (PlanetScale) | 5 min | |
| Connect to Vercel | 2 min | |
| Set environment variables | 3 min | |
| Deploy | 3-5 min | |
| **Total** | **17-22 min** | |

---

## 🧪 Test After Deployment

Once deployed to Vercel:

1. **Visit your app:** `https://your-vercel-domain.vercel.app`
2. **Test home page:** See statistics and hero section
3. **Test browse:** Search and filter questions
4. **Test registration:** Create a test account
5. **Test login:** Login with test account
6. **Test upload:** Create question bank and upload question
7. **Test public access:** Logout and verify public browsing still works

---

## 🆘 Common Issues & Solutions

### "Build failed on Vercel"
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure database is accessible

### "Cannot connect to database"
- Verify DB credentials in Vercel env vars
- Check database is running and accessible
- Ensure firewall allows connections from Vercel IPs

### "Frontend builds but API returns 404"
- Check that server routes are properly registered
- Verify API_URL environment variable
- Check CORS configuration

### "Styles are broken on production"
- Clear Vercel cache: Project Settings → Deployments → Redeploy
- Verify CSS files are in dist/assets/
- Check vite.config.ts build settings

---

## 🔒 Security Checklist

Before going live:

- [ ] JWT_SECRET is long (32+ characters) and random
- [ ] Passwords are strong and unique
- [ ] HTTPS is enabled (Vercel does this automatically)
- [ ] CORS is restricted to your domain
- [ ] API rate limiting is configured
- [ ] Email verification is enabled
- [ ] Admin account is created and secured
- [ ] Backups are configured
- [ ] Error logs are monitored

---

## 📊 Monitor After Deployment

Once live:

1. **Vercel Analytics:** Track page load times, errors
2. **Uptime Monitoring:** Use services like UptimeRobot
3. **Error Tracking:** Setup Sentry or similar
4. **Database Backups:** Schedule automatic backups
5. **Performance:** Monitor slow queries and API response times

---

## 🎯 Quick Commands Reference

```powershell
# Check git status
git status

# View commit history
git log --oneline

# Make changes and commit
git add .
git commit -m "Your message"
git push

# Create a new branch
git checkout -b feature/new-feature
git push -u origin feature/new-feature

# Merge to main
git checkout main
git merge feature/new-feature
git push
```

---

## 📞 Help & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Git Docs:** https://git-scm.com/doc
- **PlanetScale:** https://planetscale.com/docs
- **Node.js Deployment:** https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

---

## ✅ Ready to Deploy!

Your code is ready. Follow these steps to go live:

1. **Create GitHub repo** (2 minutes)
2. **Push code** (2 minutes)
3. **Setup database** (5 minutes)
4. **Deploy to Vercel** (5 minutes)
5. **Test** (5 minutes)

**Total time: ~20 minutes** ⏱️

Your HND Question Bank will be live at: `https://your-domain.vercel.app` 🎉

---

**Next Action:** Create GitHub repository and push code!

Need help? Check the specific guides above for your situation.
