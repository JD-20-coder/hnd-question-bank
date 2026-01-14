# HND Question Bank - Website Ready for Production 🚀

## ✅ Status: FULLY FUNCTIONAL & PRODUCTION READY

All components have been audited, tested, and fixed. The website is ready to be hosted on Vercel or any Node.js hosting platform.

---

## 🎯 What You Need to Know

### ✨ Features Included

1. **User Authentication**
   - Register & Login system
   - JWT token-based authentication
   - Password reset via email
   - Role-based access (Student/Instructor/Admin)

2. **Question Bank Management**
   - Create, edit, and delete question banks
   - Organize questions by subject/topic
   - View all available banks
   - Search and filter functionality

3. **Question Editor**
   - Support for MCQ, Short Answer, Long Answer, True/False
   - Rich text editing with formatting
   - File attachments (PDF, DOCX, Images)
   - Question preview
   - Difficulty levels and tags

4. **Dashboard**
   - View statistics (total users, banks, questions)
   - Quick action buttons
   - Recent activity feed
   - User profile management

5. **Exam Builder**
   - Create custom exams
   - Add/remove questions
   - Set exam duration
   - Schedule exams

6. **File Management**
   - Upload question attachments
   - Download files
   - File storage integration

---

## 🚀 Quick Start Guide

### Step 1: Prepare Your Environment
Make sure you have:
- Node.js 16+ installed
- MySQL 5.7+ installed and running
- A code editor (VS Code recommended)

### Step 2: Configure Database
Edit `server/.env`:
```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hnd_question_bank
JWT_SECRET=change-this-to-random-string
```

### Step 3: Start Development
```bash
# Run this from the project root directory
npm run dev

# This will start:
# - Server on http://localhost:4000
# - Client on http://localhost:5173
```

### Step 4: Create Database Tables
```bash
cd server
npm run migrate
```

### Step 5: Open in Browser
Visit: **http://localhost:5173**

---

## 🌐 Deploy to Vercel (5 Minutes)

### Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B: Using GitHub
1. Push code to GitHub
2. Go to vercel.com → "Import Project"
3. Select your GitHub repository
4. Set environment variables (see below)
5. Click "Deploy"

### Set These Environment Variables in Vercel:
```
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=hnd_question_bank
JWT_SECRET=generate-random-string
FRONTEND_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📁 Project Organization

```
hnd-question-bank/
├── server/           # Express backend API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── models/   # Database models
│   │   └── migrations/ # Database schemas
│   └── dist/         # Compiled code
├── client/           # React frontend
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   └── services/ # API calls
│   └── dist/         # Built website
└── package.json      # Root configuration
```

---

## 🔑 Test Credentials

Use these to test the application:

**Student Account:**
- Email: `student@example.com`
- Password: `student123`

**Instructor Account:**
- Email: `instructor@example.com`
- Password: `instructor123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

> Note: These are created when you run `npm run seed`

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start both servers

# Build
npm run build           # Build for production

# Database
npm run migrate         # Create database tables
npm run seed            # Add sample data

# Individual servers
npm run dev:server      # Start backend only
npm run dev:client      # Start frontend only
```

---

## 📝 Key Files to Know About

| File | Purpose |
|------|---------|
| `server/.env` | Database and API configuration |
| `client/.env.local` | Frontend configuration (dev) |
| `client/.env.production` | Frontend configuration (prod) |
| `vercel.json` | Vercel deployment config |
| `Dockerfile` | Docker deployment config |

---

## ⚠️ Important Notes

### Database Setup
- Make sure MySQL is running before starting the app
- First time: Run `npm run migrate` to create tables
- Tables are auto-created if they don't exist

### JWT Secret
- Change the JWT_SECRET in `.env` for production
- Generate a random string: `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`

### CORS Configuration
- CORS is already enabled
- Frontend URL should match `FRONTEND_URL` in `.env`

### File Uploads
- Files are stored in `server/uploads/`
- Max file size: 25MB
- Supported types: PDF, DOCX, Images, etc.

---

## 🧪 Testing the API

### Using cURL:
```bash
# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get banks (public endpoint)
curl http://localhost:4000/api/banks
```

---

## 🎨 Customize the Website

### Change Colors
Edit `client/src/index.css`:
```css
--accent: #8b5cf6;      /* Purple */
--success: #10b981;     /* Green */
--error: #ef4444;       /* Red */
```

### Change Site Title
- `client/index.html` - Browser title
- `client/src/pages/Landing.tsx` - Landing page title

---

## 📊 Website Structure

### Public Pages
- **Landing Page** (`/`) - Homepage with features
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration
- **Forgot Password** (`/forgot-password`) - Password reset

### Protected Pages (Require Login)
- **Dashboard** (`/dashboard`) - Statistics and overview
- **Question Banks** (`/banks`) - Browse and manage banks
- **Questions** (`/questions`) - Browse all questions
- **Exams** (`/exams`) - Create and manage exams
- **User Profile** (`/users/me`) - User settings

---

## 🔒 Security Features

✅ JWT authentication  
✅ Password hashing with bcrypt  
✅ CORS protection  
✅ SQL injection prevention  
✅ Input validation  
✅ Role-based access control  
✅ Secure token refresh  
✅ Email verification ready  

---

## 📞 Troubleshooting

### "Cannot connect to database"
```
Make sure MySQL is running:
Windows: Services → MySQL → Start
Mac: brew services start mysql
Linux: sudo systemctl start mysql
```

### "Port 4000/5173 already in use"
```
Change PORT in .env or kill the process:
Windows: netstat -ano | findstr :4000
Mac/Linux: lsof -i :4000 | kill -9 <PID>
```

### "npm: command not found"
```
Install Node.js from nodejs.org
```

### Build errors
```
Delete node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Request password reset

### Banks
- `GET /api/banks` - List all
- `POST /api/banks` - Create
- `GET /api/banks/:id` - Get one
- `PUT /api/banks/:id` - Update
- `DELETE /api/banks/:id` - Delete

### Questions
- `GET /api/questions` - List all
- `POST /api/questions` - Create
- `GET /api/questions/:id` - Get one
- `PUT /api/questions/:id` - Update
- `DELETE /api/questions/:id` - Delete

### Exams
- `GET /api/exams` - List exams
- `POST /api/exams` - Create exam
- `POST /api/exams/:id/questions` - Add questions

### Utilities
- `POST /api/uploads` - Upload file
- `GET /api/stats` - Get statistics
- `GET /api/users/me` - Current user

---

## 🎓 Example: Creating a Question Bank

```javascript
// Step 1: Login
const loginRes = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'student123'
  })
});
const { accessToken } = await loginRes.json();

// Step 2: Create bank
const bankRes = await fetch('http://localhost:4000/api/banks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    title: 'Physics Questions',
    description: 'All physics related questions'
  })
});
const { id: bankId } = await bankRes.json();

// Step 3: Add question to bank
const questionRes = await fetch('http://localhost:4000/api/questions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    bankId,
    title: 'What is Newton\'s First Law?',
    body: '<p>Question content here</p>',
    type: 'long',
    difficulty: 'medium',
    answer: 'An object in motion stays in motion...'
  })
});
```

---

## ✨ Next Steps

1. **Local Testing**
   - Run `npm run dev`
   - Test all features
   - Create some question banks

2. **Database Backup**
   - Export your database before deploying

3. **Deploy**
   - Push to GitHub
   - Connect to Vercel
   - Set environment variables
   - Deploy!

4. **Monitor**
   - Check Vercel logs
   - Monitor database performance
   - Collect user feedback

---

## 📖 Full Documentation

See these files for more details:
- `DEPLOYMENT.md` - Complete deployment guide
- `README.md` - Project overview
- `QUICK_START.md` - 5-minute setup
- `API.md` - Full API documentation (if available)

---

## 🎉 You're All Set!

Your HND Question Bank website is:
- ✅ Fully functional
- ✅ Production-ready
- ✅ Tested and working
- ✅ Ready for deployment

**Happy coding!** 🚀

---

**Last Updated:** January 14, 2026  
**Version:** 1.0.0  
**Status:** PRODUCTION READY
