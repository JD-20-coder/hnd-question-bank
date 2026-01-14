# HND Question Bank - Complete Status & Commands

## 🎯 Executive Summary

Your application has a solid foundation with:
- ✅ Backend API structure (Express.js + MySQL)
- ✅ Frontend scaffold (React + TypeScript + Vite)
- ✅ Authentication system (JWT)
- ✅ Database schema defined
- ✅ Improved UI styling (dark mode, responsive)

**Status: 60% Complete** - Needs database setup, npm install, and a few remaining components.

---

## 🚀 FASTEST WAY TO GET STARTED

### Option 1: Automated Setup (Recommended)

**Prerequisites:**
- Node.js 16+ installed: https://nodejs.org/
- MySQL 5.7+ running

**Windows - Run Setup Script:**
```powershell
# Navigate to project folder
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank"

# Allow script execution (one-time)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Run setup
.\setup.ps1
```

**macOS/Linux - Run Setup Script:**
```bash
cd /path/to/hnd-question-bank
chmod +x setup.ps1
./setup.ps1
```

---

### Option 2: Manual Setup (If Script Fails)

#### Step 1: Install Dependencies
```powershell
cd server
npm install

cd ..\client
npm install
```

#### Step 2: Start MySQL
```powershell
# Option A: Local MySQL
mysql -u root -p
# or
mysql -u root -p -h 127.0.0.1

# Option B: Docker
docker run --name mysql-hnd -e MYSQL_ROOT_PASSWORD=root -d -p 3306:3306 mysql:8
```

#### Step 3: Configure Database (`.env` file)
**Location:** `server/.env`
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hnd_question_bank

JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=4000
```

#### Step 4: Initialize Database
```powershell
cd server

# Create tables
npm run migrate

# Add sample data
npm run seed
```

#### Step 5: Start Application
**Terminal 1:**
```powershell
cd server
npm run dev
```

**Terminal 2:**
```powershell
cd client
npm run dev
```

Then open: **http://localhost:5173**

---

## 📋 What's Been Completed

### ✅ Backend
- [x] Express server with CORS
- [x] MySQL connection pool
- [x] User authentication (register/login)
- [x] JWT token generation & refresh
- [x] Password reset flow
- [x] Question bank CRUD
- [x] Questions CRUD
- [x] File upload support
- [x] Database migrations
- [x] Seed data script

### ✅ Frontend
- [x] React Router setup
- [x] Login/Register pages (redesigned)
- [x] Form validation
- [x] Component structure
- [x] CSS styling (dark mode, responsive)
- [x] Sidebar navigation
- [x] Search functionality
- [x] User profile/logout

### ✅ UI/UX
- [x] Modern dark theme
- [x] Glassmorphism design
- [x] Responsive layout
- [x] Form controls
- [x] Button variants
- [x] Alert/error messages
- [x] Modal dialogs
- [x] Smooth animations

---

## 📝 What Still Needs Implementation

### High Priority
| Component | Status | Est. Time |
|-----------|--------|-----------|
| Dashboard Page | Scaffolded | 2 hours |
| BankDetail Page | Not started | 2 hours |
| QuestionEditor | Scaffolded | 3 hours |
| Exam Generator | Not started | 4 hours |
| Search/Filter | Partial | 1 hour |

### Medium Priority
- [ ] Pagination for lists
- [ ] Tags system UI
- [ ] Analytics dashboard
- [ ] Question preview (Markdown)
- [ ] Email notifications

### Low Priority
- [ ] Theme toggle (dark/light)
- [ ] Offline support
- [ ] Export as PDF
- [ ] Import from CSV
- [ ] Gamification (points/badges)

---

## 🔧 Complete Command Reference

### Server Commands
```powershell
cd server

npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Run production build
npm run migrate      # Create database tables
npm run seed         # Add sample data
npm test             # Run tests
```

### Client Commands
```powershell
cd client

npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database Commands
```powershell
# Using MySQL CLI
mysql -u root -p -h 127.0.0.1

# Check tables
SHOW TABLES;

# View users
SELECT * FROM users;

# View question banks
SELECT * FROM question_banks;
```

---

## 🗄️ Database Schema

```
users
├── id (BIGINT, PK)
├── email (VARCHAR)
├── password_hash (VARCHAR)
├── full_name (VARCHAR)
├── role (ENUM: student, instructor, admin)
├── is_verified (BOOLEAN)
└── created_at, updated_at (TIMESTAMP)

question_banks
├── id (BIGINT, PK)
├── title (VARCHAR)
├── description (TEXT)
├── owner_id (FK → users)
└── created_at, updated_at (TIMESTAMP)

questions
├── id (BIGINT, PK)
├── bank_id (FK → question_banks)
├── author_id (FK → users)
├── title (VARCHAR)
├── body (TEXT)
├── answer (TEXT)
├── difficulty (ENUM: easy, medium, hard)
├── type (ENUM: mcq, short, long, truefalse)
└── created_at, updated_at (TIMESTAMP)

tags, question_tags, refresh_tokens, exams, attempts
(See diagrams/database-schema.sql for full details)
```

---

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Question Banks
```
GET    /api/banks                 # List all
POST   /api/banks                 # Create
GET    /api/banks/:id             # Get single
PUT    /api/banks/:id             # Update
DELETE /api/banks/:id             # Delete
GET    /api/banks/:id/questions   # Get bank's questions
```

### Questions
```
GET    /api/questions             # List all
POST   /api/questions             # Create
GET    /api/questions/:id         # Get single
PUT    /api/questions/:id         # Update
DELETE /api/questions/:id         # Delete
```

### Users & Stats
```
GET    /api/users/me              # Current user
GET    /api/stats/dashboard       # Dashboard stats
POST   /api/uploads               # Upload file
```

---

## 🎨 UI Components Created

### Pages
- **Login** - Centered, card-based, with forgot password link
- **Register** - Form validation, password strength check
- **Dashboard** - Stats cards (to be implemented)
- **BankList** - Grid of banks with create modal
- **BankDetail** - Single bank with questions (to be implemented)
- **QuestionList** - List with search/filter
- **QuestionEditor** - Rich text editor for questions (to be implemented)

### Components
- **Layout** - Main app layout with sidebar + main content
- **Sidebar** - Navigation, branding, pro features
- **Topbar** - Search, user profile with dropdown menu
- **Modal** - Reusable dialog component
- **BankCard** - Visual bank card
- **BankForm** - Form to create/edit banks
- **PrivateRoute** - Auth guard for protected routes

### Styling Classes
```css
/* Buttons */
.btn              /* Primary (gradient) */
.btn.secondary    /* Secondary (muted) */
.btn.ghost        /* Outlined */
.btn.danger       /* Red destructive */
.btn.success      /* Green positive */

/* Forms */
.form-group       /* Label + input wrapper */

/* Alerts */
.alert.success    /* Green alert */
.alert.error      /* Red alert */
.alert.warning    /* Yellow alert */

/* Layout */
.card             /* Glass card */
.grid             /* Auto-fill grid */
.flex             /* Flex container */
.center           /* Center align */
```

---

## 🐛 Troubleshooting

### "Cannot find module" Error
```powershell
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Database Connection Failed
```
Error: getaddrinfo ENOTFOUND 127.0.0.1
```
**Solutions:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify `.env` has correct credentials
3. For Docker: `docker ps` and `docker start mysql-hnd`

### Port Already in Use
```powershell
# Find what's using port 4000
netstat -ano | findstr :4000

# Kill process
taskkill /PID <process-id> /F
```

### npm install ETIMEDOUT
```powershell
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm install
```

### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

---

## 📚 Helpful Resources

- [React Router Docs](https://reactrouter.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (if you want to switch styling)

---

## ✨ Next Development Tasks

After setup is complete, prioritize:

1. **Implement Dashboard** (2 hrs)
   - Fetch stats from backend
   - Display user's banks and recent questions
   - Show activity timeline

2. **Complete BankDetail** (2 hrs)
   - Show all questions in a bank
   - Add/edit/delete questions
   - View question answers

3. **Improve QuestionEditor** (3 hrs)
   - Rich text editor (react-quill already installed)
   - Add MCQ options
   - Preview markdown

4. **Add Search & Filters** (1 hr)
   - Search questions by title
   - Filter by difficulty
   - Filter by type

5. **Exam Generator** (4 hrs)
   - Select questions for exam
   - Set time limits
   - Generate PDF

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS (not HTTP)
- [ ] Validate all inputs on backend
- [ ] Use prepared statements for DB queries
- [ ] Hash passwords (already using bcrypt)
- [ ] Set CORS_ORIGIN correctly
- [ ] Expire refresh tokens properly
- [ ] Implement rate limiting
- [ ] Add input sanitization

---

## 🎉 You're All Set!

**What you have now:**
- Modern, responsive dark-mode UI
- Full authentication system
- Database structure
- Component library
- API backend

**Next step:** Run `.\setup.ps1` and see it in action!

Questions? Check SETUP_GUIDE.md for detailed instructions.

Happy coding! 🚀
