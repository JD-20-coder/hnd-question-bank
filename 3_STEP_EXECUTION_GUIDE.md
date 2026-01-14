# 🚀 3-STEP EXECUTION GUIDE

## Overview

Execute these 3 steps to get your HND Question Bank live. **Total time: ~20 minutes**

---

## ⚙️ STEP 1: SETUP DATABASE (5 minutes)

### What This Does:
Creates all database tables, indexes, and structure needed for the application.

### Prerequisites:
- MySQL server must be running
- .env file in server folder with correct credentials

### Execute:

**Option A: Auto-Setup (Recommended)**

```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank"
cd server
npm run migrate
npm run seed
cd ..
```

**What happens:**
- ✅ Creates 8 database tables
- ✅ Adds performance indexes
- ✅ Creates database views
- ✅ Inserts test data (students, instructors, admins)

**Expected Output:**
```
✅ Running 001_initial.sql
✅ OK 001_initial.sql
✅ Running 002_attachments.sql
✅ OK 002_attachments.sql
✅ Running 003_public_access.sql
✅ OK 003_public_access.sql
✅ Migrations complete

✅ Seeding database...
✅ Created test users
✅ Created sample question banks
✅ Seeding complete
```

### If Migration Fails:

**Check if MySQL is running:**
```powershell
# Windows - Check services
Get-Service | Where-Object {$_.Name -like "*mysql*"} | Select-Object Status

# If not running, start it:
net start MySQL80  # or your MySQL version
```

**Verify .env file exists:**
```powershell
cd server
Get-Content .env  # Should show DB credentials
```

**Test MySQL connection:**
```powershell
mysql -u root -p
# Type your password
# Should show: mysql>
# Type: exit
```

---

## 🌐 STEP 2: TEST LOCALLY (10 minutes)

### What This Does:
Starts both frontend (React) and backend (Node.js) servers so you can test the website in your browser.

### Execute:

```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank"
npm run dev
```

### Expected Output:

**You should see in the terminal:**

```
  VITE v5.x.x ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help

[Backend] Server running on http://localhost:4000
```

### Test in Browser:

1. **Open:** http://localhost:5173
2. **You should see:** Home page with hero section
3. **Try these:**
   - [ ] View home page stats
   - [ ] Click "Browse All Questions"
   - [ ] Use search filters
   - [ ] Click a question to view details
   - [ ] Click "Show Answer" toggle
   - [ ] Register new account
   - [ ] Login with credentials
   - [ ] Create a question bank
   - [ ] Upload a question
   - [ ] Search for your question

### Test Data (Pre-Loaded):

```
Email: student@example.com
Password: student123
Role: Student

Email: instructor@example.com
Password: instructor123
Role: Instructor

Email: admin@example.com
Password: admin123
Role: Admin
```

### Troubleshooting:

**"Cannot connect to http://localhost:5173"**
- Wait 10 seconds, Vite is building
- Check terminal for errors
- Try refreshing page

**"API errors in console"**
- Make sure database is running
- Check server logs in terminal
- Verify .env file in server folder

**"Styles look broken"**
- Hard refresh: Ctrl+Shift+Delete
- Clear cache and reload

**"Search returns no results"**
- You need to add question banks with `is_public = true`
- Use test data from `npm run seed` command
- Or manually create banks in dashboard

---

## 📦 STEP 3: BUILD FOR PRODUCTION (5 minutes)

### What This Does:
Creates optimized production builds for deployment to Vercel, Docker, or your server.

### Execute:

```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank"
npm run build
```

### Expected Output:

```
> hnd-question-bank@1.0.0 build
> npm run build:server && npm run build:client

Building server...
✓ 123 files compiled

Building client...
✓ 298 modules transformed
✓ 17 asset files created
```

### Verify Build:

```powershell
# Check client build
Get-ChildItem -Path "client\dist" -Recurse | Measure-Object | Select-Object -ExpandProperty Count
# Should show: 35+ files

# Check server build
Get-ChildItem -Path "server\dist" -Recurse | Measure-Object | Select-Object -ExpandProperty Count
# Should show: 50+ files
```

### Build Output:

**Client Folder (`client/dist/`):**
```
index.html              → Main HTML file
assets/
  └─ index-xxx.js      → React app (gzipped)
  └─ react-xxx.js      → React library
  └─ Home.css          → Styles
  └─ [other assets]
```

**Server Folder (`server/dist/`):**
```
index.js               → Compiled server
db.js                  → Database module
routes/
  ├─ auth.js
  ├─ public.js         → NEW: Public API
  ├─ banks.js
  ├─ questions.js
  └─ ...more
middleware/
models/
utils/
```

### What's Built:

- ✅ Minified JavaScript bundles
- ✅ Optimized CSS files
- ✅ Compiled TypeScript to JavaScript
- ✅ All dependencies bundled
- ✅ Ready for production deployment

---

## ✅ VERIFICATION CHECKLIST

After completing all 3 steps, verify:

**Database:**
- [ ] `npm run migrate` completed without errors
- [ ] `npm run seed` added test users
- [ ] MySQL running and accessible

**Development Servers:**
- [ ] `npm run dev` started both servers
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend API responds at http://localhost:4000/api/public/stats
- [ ] No errors in browser console (F12)
- [ ] No errors in server terminal

**Features:**
- [ ] Home page displays with statistics
- [ ] Browse page shows questions
- [ ] Search filters work
- [ ] Question details display
- [ ] Answer toggle works
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can create question bank
- [ ] Can upload question
- [ ] Question appears in public search
- [ ] Mobile responsive design works

**Production Build:**
- [ ] `npm run build` completed successfully
- [ ] `client/dist/` folder exists with files
- [ ] `server/dist/` folder exists with files
- [ ] No TypeScript errors
- [ ] No bundling errors

---

## 🎯 QUICK COMMAND REFERENCE

```powershell
# Step 1: Setup Database
cd server
npm run migrate
npm run seed
cd ..

# Step 2: Test Locally
npm run dev
# Open http://localhost:5173

# Step 3: Build for Production
npm run build

# Verify build exists
ls -la client/dist/
ls -la server/dist/
```

---

## 📊 TIMELINE

```
Step 1 (Database)     ⏱️ 3-5 minutes
Step 2 (Dev Servers)  ⏱️ 5-10 minutes (while you test)
Step 3 (Build)        ⏱️ 2-3 minutes
─────────────────────────────────
Total                 ⏱️ ~15-20 minutes
```

---

## 🚀 AFTER THESE 3 STEPS

### You Have:
✅ Working local development environment  
✅ Production-ready builds  
✅ Database with test data  
✅ All features tested and verified  

### Next (When Ready to Deploy):

**Option 1: Vercel (Recommended)**
```powershell
# 1. Push to GitHub
git push

# 2. Login to vercel.com
# 3. Connect repository
# 4. Deploy automatically
```

**Option 2: Docker**
```powershell
docker build -t hnd-question-bank .
docker run -p 4000:4000 hnd-question-bank
```

**Option 3: Traditional Server**
```powershell
# Copy dist folders to server
# Run: npm start
```

---

## 💡 HELPFUL TIPS

1. **Keep dev servers running** while testing - don't close the terminal
2. **MySQL must run** for database operations and API calls
3. **Use test credentials** to quickly test features
4. **Hard refresh browser** (Ctrl+Shift+Del) if styles look broken
5. **Check both consoles** - browser (F12) and server terminal for errors

---

## 🆘 HELP

**If anything fails:**

1. Check the error message carefully
2. Read the corresponding troubleshooting section above
3. Verify all prerequisites are met
4. Check documentation files:
   - PUBLIC_ACCESS_QUICK_START.md
   - TROUBLESHOOTING.md
   - HOW_TO_RUN.md

**Common Issues:**

| Issue | Solution |
|-------|----------|
| MySQL connection error | Start MySQL: `net start MySQL80` |
| Port 5173 already in use | Close other apps or use different port |
| Database migration fails | Check .env file has correct credentials |
| Build fails | Run `npm install` in both folders |
| Blank page loading | Wait for build, check console for errors |

---

## 🎉 YOU'RE READY!

All 3 steps are straightforward:

1. **Setup DB** → `npm run migrate && npm run seed`
2. **Test** → `npm run dev` → Open browser
3. **Build** → `npm run build`

**Start now:** Run Step 1 in your terminal! 🚀

---

**Status:** Production-Ready  
**Date:** January 14, 2026  
**Time to Complete:** ~20 minutes
