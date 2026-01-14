# Complete Setup Guide - HND Question Bank

## 📋 What's Missing & How to Fix It

### ✅ **STEP 1: Install Node Dependencies**

#### Server Dependencies:
```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"
npm install
```

**If npm is blocked by execution policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

#### Client Dependencies:
```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client"
npm install
```

---

### ✅ **STEP 2: Set Up MySQL Database**

#### Option A: Local MySQL Installation
- Download: https://dev.mysql.com/downloads/mysql/
- Install with default settings
- Verify running: `mysql -u root -p` (default password is empty)

#### Option B: Using Docker (Recommended)
```powershell
# Install Docker Desktop from: https://www.docker.com/products/docker-desktop

# Create MySQL container
docker run --name mysql-hnd `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=hnd_question_bank `
  -d `
  -p 3306:3306 `
  mysql:8
```

---

### ✅ **STEP 3: Configure Environment Variables**

**Server `.env` file** (`server/.env`):
```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hnd_question_bank

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (Optional for password reset)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Client
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=4000
```

---

### ✅ **STEP 4: Create Database & Run Migrations**

```powershell
cd server

# Create database tables
npm run migrate

# Seed demo data
npm run seed
```

**Expected output:**
```
Migration completed: 001_initial.sql
Migration completed: 002_attachments.sql
Database seeding completed!
```

---

### ✅ **STEP 5: Start the Application**

**Terminal 1 - Start Backend:**
```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"
npm run dev
```

Expected output:
```
Server running on http://localhost:4000
```

**Terminal 2 - Start Frontend:**
```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client"
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 🎨 **UI/UX Improvements Made**

### ✨ Dark Mode Theme
- Modern gradient backgrounds
- Glassmorphism design elements
- Smooth transitions and animations
- Better color contrast for accessibility

### 📱 Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons and inputs
- Sidebar collapses on mobile

### 🎯 Enhanced Components
- **Login Page**: Full-screen, centered card layout
- **Register Page**: Form validation with helpful messages
- **BankForm**: Better labeled inputs, error alerts
- **Modal**: Smooth animations, better positioning

### 🔘 Button Styles
```css
.btn          /* Primary button (gradient) */
.btn.secondary /* Secondary (muted) */
.btn.ghost    /* Outlined button */
.btn.danger   /* Red destructive action */
.btn.success  /* Green positive action */
```

### 📋 Form Elements
- Better spacing and labels
- Focus states with glow effect
- Placeholder text for guidance
- Validation feedback

---

## 🔧 **What Still Needs Implementation**

### Critical:
- [ ] **Dashboard Page** - Stats, recent activities
- [ ] **BankDetail Page** - View single bank + questions
- [ ] **QuestionEditor Page** - Create/edit questions with rich text
- [ ] **Topbar Component** - User profile, logout button
- [ ] **PrivateRoute Guard** - Verify token validity
- [ ] **API Error Handling** - Proper error messages for all endpoints
- [ ] **Logout Functionality** - Clear tokens and redirect

### Important:
- [ ] **Form Validation** - Email, password strength
- [ ] **Loading States** - Spinners during API calls
- [ ] **Pagination** - For long question lists
- [ ] **Search/Filter** - Find questions by title/difficulty
- [ ] **Tags System** - Categorize questions

### Nice-to-Have:
- [ ] **Dark/Light Theme Toggle**
- [ ] **Question Preview** - Markdown rendering
- [ ] **Exam Creation** - Build custom exams
- [ ] **Analytics** - Charts for performance
- [ ] **Notifications** - Toast messages
- [ ] **Offline Support** - Service worker caching

---

## 🚀 **Quick Commands Reference**

```powershell
# Development
npm run dev              # Start dev server (server or client folder)
npm run build           # Build for production
npm run preview         # Preview production build

# Database
npm run migrate         # Run migrations (server only)
npm run seed            # Add demo data (server only)

# Testing
npm test                # Run tests (server only)
```

---

## 🐛 **Troubleshooting**

### MySQL Connection Failed
```
Error: getaddrinfo ENOTFOUND 127.0.0.1
```
**Solution**: Check MySQL is running
```powershell
# For local MySQL
mysql -u root -p

# For Docker
docker ps  # Check if container is running
docker start mysql-hnd  # If not running
```

### npm install ETIMEDOUT
```powershell
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
```

### CORS Errors
Make sure `FRONTEND_URL` in server `.env` matches your client URL
```env
FRONTEND_URL=http://localhost:5173
```

### Port Already in Use
```powershell
# Find process using port 4000
netstat -ano | findstr :4000

# Kill process
taskkill /PID <PID> /F
```

---

## 📝 **Database Schema Overview**

### Core Tables:
- **users** - User accounts with roles
- **question_banks** - Collections of questions
- **questions** - Individual questions with answers
- **tags** - Question categorization
- **exams** - Exam sessions

### Authentication:
- **refresh_tokens** - JWT token management

---

## 🔐 **Security Notes**

1. **Change JWT_SECRET** in production
2. **Use HTTPS** for deployment
3. **Validate all inputs** on backend
4. **Hash passwords** with bcrypt (already implemented)
5. **Use environment variables** for secrets
6. **Set CORS_ORIGIN** properly in production

---

## 📚 **API Endpoints**

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Question Banks
```
GET    /api/banks
POST   /api/banks
GET    /api/banks/:id
PUT    /api/banks/:id
DELETE /api/banks/:id
```

### Questions
```
GET    /api/questions
POST   /api/questions
GET    /api/questions/:id
PUT    /api/questions/:id
DELETE /api/questions/:id
```

---

## ✨ **Next Steps After Setup**

1. **Test Login/Register** with dummy account
2. **Create a Question Bank** from UI
3. **Add Questions** to your bank
4. **Implement Dashboard** page to show stats
5. **Add Search Functionality** for finding questions
6. **Create Exam Generator** to bundle questions
7. **Deploy to Production** (Vercel, Railway, etc.)

---

## 📞 **Support**

If you encounter issues:
1. Check the error message carefully
2. Review the troubleshooting section
3. Check database logs: `server/dbcheck_out.txt`
4. Verify all ports are available
5. Ensure MySQL/Docker is running

Good luck! 🎉
