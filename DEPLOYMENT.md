# HND Question Bank - Complete Setup & Deployment Guide

## ✅ What's Completed

All code has been audited and fixed. The application is now:
- ✅ TypeScript fully compiled
- ✅ All dependencies installed
- ✅ Database migrations ready
- ✅ All routes working
- ✅ Frontend components functional
- ✅ Production builds created

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+
- MySQL 5.7+
- Git (for version control)

### 1. Start MySQL
Make sure MySQL is running on your machine. Update the `.env` file if needed:

```bash
cd "c:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank"
# Edit server/.env with your database credentials
```

Default `.env` values:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hnd_question_bank
```

### 2. Setup Database
```bash
cd server
npm run migrate  # Create database tables
npm run seed     # Add sample data (optional)
```

### 3. Run Development Servers
```bash
# From root directory
npm run dev

# Or manually in separate terminals:
cd server && npm run dev     # Backend on http://localhost:4000
cd client && npm run dev     # Frontend on http://localhost:5173
```

### 4. Open in Browser
Visit: **http://localhost:5173**

**Test Accounts:**
- Email: `student@example.com` | Password: `student123`
- Email: `instructor@example.com` | Password: `instructor123`
- Email: `admin@example.com` | Password: `admin123`

---

## 📦 Production Build

### Build for Production
```bash
npm run build

# This creates:
# - server/dist/   (compiled backend)
# - client/dist/   (compiled frontend)
```

### Run Production Server
```bash
npm run build
npm start
```

Server will run on `http://localhost:4000` (frontend served from `/`)

---

## 🌐 Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Connect GitHub Repo to Vercel Dashboard

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HND Question Bank"
   git remote add origin https://github.com/YOUR_USERNAME/hnd-question-bank
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect GitHub and select the repo
5. Set environment variables (see below)
6. Deploy!

### 3. Set Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

```
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=hnd_question_bank
JWT_SECRET=<generate-random-string>
FRONTEND_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

**Generate a random JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Update Client Production ENV

Edit `client/.env.production`:
```
VITE_API_BASE=https://your-vercel-domain.vercel.app/api
```

---

## 🐳 Deploy with Docker

### Build Docker Image
```bash
docker build -t hnd-question-bank .
```

### Run Container
```bash
docker run -p 4000:4000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=root \
  -e DB_PASSWORD=your_password \
  -e DB_NAME=hnd_question_bank \
  -e JWT_SECRET=your_secret_key \
  hnd-question-bank
```

### Push to Docker Hub
```bash
docker tag hnd-question-bank YOUR_USERNAME/hnd-question-bank:latest
docker push YOUR_USERNAME/hnd-question-bank:latest
```

---

## 📁 Project Structure

```
hnd-question-bank/
├── server/                 # Express backend
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── db.ts          # Database connection
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & validation
│   │   └── migrations/    # SQL migrations
│   └── dist/              # Compiled JavaScript
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API calls
│   │   └── utils/         # Helpers
│   └── dist/              # Built frontend
├── .env                   # Environment variables
├── vercel.json           # Vercel configuration
└── Dockerfile            # Docker configuration
```

---

## 🔑 Features Implemented

### User Management
- ✅ Registration & Login
- ✅ JWT authentication
- ✅ Password reset via email
- ✅ User profiles
- ✅ Role-based access (student/instructor/admin)

### Question Banks
- ✅ Create question banks
- ✅ Edit banks
- ✅ Delete banks
- ✅ View all banks
- ✅ Filter by owner

### Questions
- ✅ Create questions (MCQ, short, long, true/false)
- ✅ Edit questions
- ✅ Delete questions
- ✅ File attachments
- ✅ Difficulty levels
- ✅ Tags & categorization

### File Management
- ✅ Upload PDF/DOCX attachments
- ✅ View uploaded files
- ✅ Download questions

### Exams
- ✅ Create exams
- ✅ Add questions to exams
- ✅ Exam scheduling
- ✅ Duration settings

### Dashboard
- ✅ Statistics (total users, banks, questions)
- ✅ Recent activity
- ✅ Quick actions

---

## 🔧 Environment Variables

### Server (.env)
```dotenv
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hnd_question_bank

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (for password reset)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SERVER_BASE_URL=http://localhost:4000
```

### Client (.env.local / .env.production)
```dotenv
VITE_API_BASE=http://localhost:4000/api  # or https://your-domain.com/api
```

---

## 🧪 Testing

### API Testing with cURL
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get banks
curl http://localhost:4000/api/banks

# Create bank (requires token)
curl -X POST http://localhost:4000/api/banks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Physics","description":"Physics questions"}'
```

---

## ⚠️ Troubleshooting

### Database Connection Error
```
Make sure MySQL is running:
- Windows: Services app → MySQL service → Start
- Mac: brew services start mysql
- Linux: sudo service mysql start

Check .env credentials match your MySQL setup
```

### CORS Errors
```
Server already has CORS enabled.
If issues persist, update server/src/index.ts:
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Change port in .env
PORT=5000  # Use different port

# Or kill existing process
# Windows: netstat -ano | findstr :4000
# macOS/Linux: lsof -i :4000 | kill -9 <PID>
```

---

## 📚 API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Banks Endpoints
- `GET /api/banks` - List all banks
- `POST /api/banks` - Create bank (auth required)
- `GET /api/banks/:id` - Get bank details
- `PUT /api/banks/:id` - Edit bank (auth required)
- `DELETE /api/banks/:id` - Delete bank (auth required)

### Questions Endpoints
- `GET /api/questions` - List recent questions
- `GET /api/questions/bank/:bankId` - Get questions by bank
- `POST /api/questions` - Create question (auth required)
- `GET /api/questions/:id` - Get question details
- `PUT /api/questions/:id` - Edit question (auth required)
- `DELETE /api/questions/:id` - Delete question (auth required)

### Other Endpoints
- `GET /api/users/me` - Get current user (auth required)
- `GET /api/users/:id` - Get user profile (auth required)
- `POST /api/uploads` - Upload file
- `GET /api/stats` - Get statistics
- `GET /api/exams` - List exams
- `POST /api/exams` - Create exam (auth required)
- `POST /api/exams/:id/questions` - Add questions to exam

---

## 🎨 Customization

### Change Theme Colors
Edit `client/src/index.css`:
```css
:root {
  --accent: #8b5cf6;      /* Purple */
  --accent-2: #7c3aed;    /* Darker purple */
  --success: #10b981;     /* Green */
  --error: #ef4444;       /* Red */
  --warning: #f59e0b;     /* Yellow */
}
```

### Change Site Title
- Update `client/index.html` `<title>`
- Update `server/src/index.ts` response message

### Add New Routes
1. Create route handler in `server/src/routes/`
2. Import in `server/src/index.ts`
3. Use `app.use('/api/newroute', newrouteRoutes)`

---

## 📝 License

MIT License - Feel free to use, modify, and distribute.

---

## 📞 Support

For issues or questions:
1. Check TROUBLESHOOTING.md
2. Review API documentation
3. Check server logs (console output)
4. Check browser console (F12)

---

**Last Updated:** January 14, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
