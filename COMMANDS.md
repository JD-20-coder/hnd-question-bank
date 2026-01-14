# HND Question Bank - Command Reference

## 🎯 To Get Started Immediately

### Copy This Entire Code Block and Run It:

```powershell
# Navigate to project
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank"

# Allow scripts to run (one-time)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Run automated setup
.\setup.ps1
```

**That's it!** The script will:
- Install Node dependencies (server & client)
- Create database tables
- Seed sample data
- Show you what to do next

---

## 🛠️ If You Prefer Manual Setup

### Step 1: Install Node Dependencies
```powershell
# Go to server folder
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"
npm install

# Go to client folder
cd "..\client"
npm install
```

**Expected:** Takes 2-5 minutes depending on internet speed

### Step 2: Create `.env` File

In `server/` folder, create a file named `.env` with this content:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hnd_question_bank
JWT_SECRET=your-super-secret-key-12345
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=4000
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

### Step 3: Start MySQL

**Option A: If you have MySQL installed locally**
```powershell
# Open Command Prompt or PowerShell
mysql -u root -p
# Press Enter if no password (default)
```

**Option B: If you have Docker**
```powershell
docker run --name mysql-hnd `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=hnd_question_bank `
  -d `
  -p 3306:3306 `
  mysql:8
```

### Step 4: Initialize Database

```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"

# Create tables
npm run migrate

# Add test data
npm run seed
```

**Expected output:**
```
Migration completed: 001_initial.sql
Migration completed: 002_attachments.sql
Database seeding completed!
```

### Step 5: Start the Application

**Open Terminal 1 (Backend):**
```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"
npm run dev
```

**Expected:**
```
Server running on http://localhost:4000
```

**Open Terminal 2 (Frontend):**
```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client"
npm run dev
```

**Expected:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 6: Open in Browser

Visit: **http://localhost:5173**

---

## 🔑 Test Login Credentials

After setup completes, you can login with:
- **Email:** test@example.com
- **Password:** password123

Or create a new account using the Register page.

---

## 📚 All Available Commands

### Server Commands
```powershell
cd server

# Development
npm run dev              # Start dev server with auto-reload
npm run build            # Compile TypeScript
npm run start            # Run compiled server

# Database
npm run migrate          # Create all database tables
npm run seed             # Add sample data
npm run check_db         # Check database connection

# Testing
npm test                 # Run Jest tests
npm test -- --watch     # Run tests in watch mode
```

### Client Commands
```powershell
cd client

# Development
npm run dev              # Start dev server on http://localhost:5173
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### Git Commands (Optional)
```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank"

git status              # Check what changed
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub
```

---

## 🐛 Common Issues & Fixes

### Issue: "MySQL Connection Failed"
```
Error: getaddrinfo ENOTFOUND 127.0.0.1
```
**Fix:**
```powershell
# Check if MySQL is running
mysql -u root -p
# If no connection, start MySQL or Docker
```

### Issue: "npm install timeout"
```
Error: npm ETIMEDOUT
```
**Fix:**
```powershell
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm install
```

### Issue: "Cannot find module"
```
Error: Cannot find module 'express'
```
**Fix:**
```powershell
# Clear and reinstall
rm -r node_modules package-lock.json
npm install
```

### Issue: "Port 4000 already in use"
```
Error: EADDRINUSE: address already in use :::4000
```
**Fix:**
```powershell
# Find process using port 4000
netstat -ano | findstr :4000

# Kill process (replace <PID> with process ID)
taskkill /PID <PID> /F

# Or use different port
# Change PORT in .env file
```

### Issue: "PowerShell script execution blocked"
```
Error: File cannot be loaded because running scripts
is disabled on this system
```
**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\setup.ps1
```

---

## 🌐 API Testing

### Using PowerShell/Terminal

**Register:**
```powershell
$body = @{
    email = "deppjerome@gmail.com"
    password = "password123"
    full_name = "Jerome Depp"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Login:**
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Using cURL (if installed)

**Register:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"deppjerome@gmail.com","password":"password123","full_name":"Jerome Depp"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📋 File Structure

```
hnd-question-bank/
├── README.md                    ← Project overview
├── QUICK_START.md              ← Quick reference
├── SETUP_GUIDE.md              ← Detailed setup
├── COMPLETION_REPORT.md        ← Status report
├── COMMANDS.md                 ← This file
├── setup.ps1                   ← PowerShell setup script
├── setup.bat                   ← Batch setup script
│
├── server/                     ← Backend (Express.js)
│   ├── .env                    ← Configuration (CREATE THIS)
│   ├── .env.example            ← Template
│   ├── package.json
│   ├── src/
│   │   ├── index.ts            ← Server entry point
│   │   ├── db.ts               ← Database connection
│   │   ├── routes/             ← API endpoints
│   │   ├── models/             ← Database models
│   │   └── migrations/         ← Database schema
│   └── test/
│
└── client/                     ← Frontend (React + Vite)
    ├── package.json
    ├── src/
    │   ├── App.tsx             ← Main app
    │   ├── index.css           ← Global styles
    │   ├── pages/              ← Page components
    │   ├── components/         ← UI components
    │   └── services/           ← API services
    └── index.html
```

---

## 🚀 Ready to Deploy?

### Build for Production
```powershell
# Frontend
cd client
npm run build

# Backend
cd server
npm run build
```

### Set Production Environment
Create new `.env` with:
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_USER=prod_user
DB_PASSWORD=your-secure-password
JWT_SECRET=long-random-production-secret
```

### Deploy Hosting Options
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Railway, Heroku, AWS, GCP, Azure
- **Database:** RDS, CloudSQL, Azure Database

---

## 💡 Pro Tips

1. **Keep two terminals open** - One for server, one for client
2. **Use VS Code** - Has great TypeScript support
3. **Install REST Client** - Test APIs from VS Code
4. **Watch mode** - Use `npm run dev` for auto-reload
5. **Dev Tools** - Use browser DevTools to inspect requests

---

## 📞 Need Help?

Check these files in order:
1. `QUICK_START.md` - Fast answers
2. `SETUP_GUIDE.md` - Detailed help
3. `COMPLETION_REPORT.md` - Project status
4. This file - Command reference

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Ran setup.ps1 without errors
- [ ] Can access http://localhost:5173
- [ ] Can see login page
- [ ] Can register new account
- [ ] Can login with test account
- [ ] Can create a question bank
- [ ] Can see sidebar navigation
- [ ] Can see user profile dropdown
- [ ] Backend running on http://localhost:4000
- [ ] MySQL database created

---

**You're all set! Enjoy building! 🎉**
