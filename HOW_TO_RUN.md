# 🚀 HOW TO RUN THE APPLICATION - STEP BY STEP

Complete guide to get the application running on your local machine.

---

## ✅ **PART 1: Setup (One Time Only)**

### Step 1: Open PowerShell
- Press `Win + R`
- Type `powershell`
- Press Enter

### Step 2: Navigate to Project
```powershell
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank"
```

### Step 3: Run Setup Script
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**What this does:**
- ✅ Creates `.env` file for server
- ✅ Installs dependencies (npm install)
- ✅ Sets up database
- ✅ Seeds test data

### Step 4: Start Database
If using MySQL on your computer, verify it's running:
```powershell
# Windows - check if MySQL is running
Get-Service MySQL80  # or MySQL57 depending on version
```

If not running, start it in Services.

---

## 🎯 **PART 2: Running the Application**

### Terminal 1: Start Backend Server

```powershell
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:4000
✓ Database connected
```

### Terminal 2: Start Frontend Client

Open a **new PowerShell window**:

```powershell
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client"
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 **PART 3: Access the Application**

### 1. Open Browser
Go to: **http://localhost:5173**

### 2. Create Account
- Click **Register**
- Enter:
  - **Full Name:** Jerome Depp
  - **Email:** deppjerome@gmail.com
  - **Password:** Password123!
- Click **Sign Up**

### 3. Login
- Click **Login**
- Enter your email and password
- Click **Sign In**

---

## 📋 **PART 4: Test Each Feature**

### ✨ Dashboard
- **Location:** http://localhost:5173/dashboard
- **What to see:**
  - 3 stat cards (Banks, Questions, Users)
  - List of question banks
  - Quick stats
- **Click:** "Create New" to add a bank

### 📚 Question Banks
- **Location:** http://localhost:5173/banks
- **What to see:**
  - Grid of all question banks
  - "Create Bank" button at top
- **Try:**
  1. Click "Create Bank"
  2. Fill in: Name, Description
  3. Click "Create"
  4. Click on a bank card to see details

### ❓ Questions
- **Location:** http://localhost:5173/questions
- **What to see:**
  - Search bar at top
  - Difficulty filter dropdown
  - Type filter dropdown
  - List of questions
- **Try:**
  1. Type in search box: "database"
  2. Select difficulty: "Hard"
  3. Select type: "MCQ"
  4. See filtered results
  5. Click delete (trash icon) to remove a question

### 🎓 Question Editor
- **Location:** http://localhost:5173/questions/1 (after creating questions)
- **What to see:**
  - Rich text editor for question body
  - Difficulty dropdown
  - Type selector
  - MCQ options (if type is MCQ)
  - File upload
- **Try:**
  1. Go to a question bank
  2. Click "+ Add Question"
  3. Fill in title
  4. Click in body field and add formatted text
  5. Change difficulty
  6. Change type to "MCQ"
  7. Add answer options
  8. Click "Save"

### 📝 Exams (New!)
- **Location:** http://localhost:5173/exams
- **What to see:**
  - "Create Exam" button
  - List of exam sessions
- **Try:**
  1. Click "Create Exam"
  2. Fill: Title = "Mid-term", Duration = 90 minutes
  3. Click "Create Exam"
  4. Click "Edit" on the exam card
  5. Click "Add Questions"
  6. Select a bank
  7. Check some questions
  8. Click "Add Questions"

---

## 🔧 **PART 5: Database (Optional View)**

### View Databases
```powershell
mysql -u root -p
```
When prompted for password, enter: `root`

Then in MySQL prompt:
```sql
USE hnd_question_bank;
SHOW TABLES;
SELECT * FROM users LIMIT 5;
SELECT * FROM question_banks LIMIT 5;
SELECT * FROM questions LIMIT 5;
```

Type `EXIT` to quit.

---

## ⚠️ **Troubleshooting**

### **Problem: "Cannot connect to server"**
**Solution:** Make sure backend is running:
```powershell
cd server
npm run dev
```

### **Problem: "Database connection failed"**
**Solution:** Check MySQL is running:
```powershell
# On Windows
net start MySQL80

# Or use Task Manager > Services > MySQL80
```

### **Problem: "Port 5173 already in use"**
**Solution:** Kill the process or use different port:
```powershell
# Stop the current process and start again
# OR use:
npm run dev -- --port 5174
```

### **Problem: "npm ERR! command not found"**
**Solution:** Install Node.js from https://nodejs.org/

### **Problem: CORS errors**
**Solution:** Check `.env` file has correct API URL:
```
VITE_API_BASE=http://localhost:4000/api
```

---

## 📊 **Test Data Included**

After setup, your database has:
- **1 User Account:** test@example.com / password123
- **3 Question Banks:** Database, OOP, Web Development
- **15 Questions:** Mix of MCQ, short answer, and true/false
- Ready to create exams immediately

---

## ✅ **Verification Checklist**

After running everything, verify:

- [ ] Dashboard shows stats (3 cards with numbers)
- [ ] Can create new question bank
- [ ] Can add questions to a bank
- [ ] Search filters work on Questions page
- [ ] Can create exam session
- [ ] Can add questions to exam
- [ ] Can edit and delete items
- [ ] Responsive on mobile (shrinks properly)
- [ ] Dark theme looks good
- [ ] No red errors in browser console

---

## 🎉 **You're All Set!**

The application is fully functional with:
- ✅ User authentication (login/register)
- ✅ Question bank management
- ✅ Question creation with rich text
- ✅ Search and filtering
- ✅ Exam session builder
- ✅ Dark theme UI
- ✅ Responsive design

**Have fun! 🚀**
