# HND Question Bank

This repository contains a question bank application (MERN-like) with a Node/Express backend and a React + Vite frontend.

## 🚀 Quick Start

**Run the automated setup (recommended):**

```powershell
# Windows - PowerShell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\setup.ps1

# macOS/Linux
chmod +x setup.ps1
./setup.ps1
```

Then visit: **http://localhost:5173**

For detailed instructions, see [QUICK_START.md](QUICK_START.md)

---

## 📋 Goals
- Provide CRUD for question banks and questions
- Authentication with JWT
- File uploads
- Simple, responsive UI with modern dark theme
- Dashboard with statistics
- Exam creation and management

---

## ✨ What's New

- **Enhanced UI** - Dark mode theme with glassmorphism design
- **Improved Forms** - Better styling, validation, error messages
- **Responsive Design** - Mobile-friendly layout
- **Automated Setup** - PowerShell and Batch scripts for easy installation
- **Complete Documentation** - Detailed guides for setup and troubleshooting

---

## 📁 Project Structure

```
hnd-question-bank/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main app
│   └── package.json
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Auth & validation
│   │   ├── migrations/    # Database schema
│   │   └── index.ts       # Server entry
│   └── package.json
├── diagrams/               # Architecture & DB schema
├── QUICK_START.md         # Fast setup guide
├── SETUP_GUIDE.md         # Detailed setup guide
├── setup.ps1              # PowerShell setup script
└── setup.bat              # Batch setup script
```

---

## 🛠️ Manual Setup (If Scripts Don't Work)

### Prerequisites
- Node.js 16+ - https://nodejs.org/
- MySQL 5.7+ - https://dev.mysql.com/downloads/mysql/
- Or Docker - https://www.docker.com/products/docker-desktop

### Step 1: Install Dependencies

```powershell
# Server
cd server
npm install

# Client
cd ..\client
npm install
```

### Step 2: Configure Database

Create `server/.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hnd_question_bank

JWT_SECRET=your-secret-key-change-this
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=4000
```

### Step 3: Initialize Database

```powershell
cd server
npm run migrate    # Create tables
npm run seed       # Add sample data
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

Open browser: **http://localhost:5173**

---

## 📖 Documentation

- [QUICK_START.md](QUICK_START.md) - Fast setup and commands reference
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed troubleshooting and info

---

## 🎨 UI Features

- **Dark Theme** - Modern gradient backgrounds
- **Glassmorphism** - Frosted glass effect on cards
- **Responsive** - Mobile, tablet, desktop layouts
- **Animations** - Smooth transitions and interactions
- **Accessible** - Good color contrast, keyboard navigation

---

## 🔑 Key Features

### Authentication
- User registration & login
- JWT token-based auth
- Password reset flow
- Role-based access (student, instructor, admin)

### Question Management
- Create/edit/delete question banks
- Add questions with different types (MCQ, short answer, etc.)
- Tag questions for organization
- Difficulty levels (easy, medium, hard)

### User Experience
- Dashboard with statistics
- Search and filter questions
- Rich text editor for answers
- File upload support

---

## 🗄️ Database

MySQL database with tables for:
- Users with roles
- Question banks
- Questions with metadata
- Tags and categorization
- Refresh tokens for auth
- Exam sessions

See `diagrams/database-schema.sql` for full schema.

---

## 📚 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
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

## 🧪 Testing

```powershell
# Run tests
cd server
npm test
```

---

## 🚀 Deployment

### Build for Production

```powershell
# Client
cd client
npm run build   # Creates dist/ folder

# Server
cd server
npm run build   # Creates dist/ folder
```

### Set Production Environment

```env
NODE_ENV=production
JWT_SECRET=your-secure-production-secret
# ... other production settings
```

---

## 🐛 Troubleshooting

**MySQL Connection Failed?**
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` credentials
- For Docker: `docker ps` and `docker start mysql-hnd`

**npm install Timeout?**
```powershell
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
```

**Port Already in Use?**
```powershell
netstat -ano | findstr :4000
taskkill /PID <process-id> /F
```

More help in [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

MIT License - feel free to use this project for educational purposes.

---

## 📞 Support

Check the documentation files:
- `QUICK_START.md` - Fast reference
- `SETUP_GUIDE.md` - Detailed help
- `diagrams/` - Architecture diagrams

---

**Status: 60% Complete** - Core features working, UI polished, ready for feature development.

Last updated: January 2026
