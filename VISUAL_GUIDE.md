# 🎨 VISUAL WORKFLOW GUIDE

Complete visual representation of the application flow.

---

## **USER JOURNEY**

```
┌─────────────────────────────────────────────────────────────────┐
│                    START (Landing Page)                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
      ┌───▼────┐           ┌────▼────┐
      │ LOGIN  │           │REGISTER │
      │  Page  │           │   Page  │
      └───┬────┘           └────┬────┘
          │                     │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │    AUTHENTICATED    │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────────────────────────────┐
          │         MAIN APP (Dashboard)                 │
          └──────────┬──────────────────────────────────┘
                     │
      ┌──────────────┼──────────────┬──────────────┐
      │              │              │              │
   ┌──▼──┐      ┌────▼────┐   ┌────▼────┐   ┌────▼───┐
   │BANKS│      │QUESTIONS│   │  EXAMS  │   │ PROFILE│
   └──┬──┘      └────┬────┘   └────┬────┘   └────┬───┘
      │              │              │              │
      │      ┌───────┴──────┐       │              │
      │      │              │       │              │
   ┌──▼──┐ ┌─▼──┐      ┌────▼──┐ ┌─▼──┐       ┌──▼──┐
   │ NEW │ │LIST│      │EDITOR │ │NEW │       │ EDIT │
   │BANK │ │    │      │       │ │EXAM│       │      │
   └──┬──┘ └────┘      └───────┘ └────┘       └──────┘
      │
   ┌──▼──────┐
   │ DETAILS │
   │+ Q's    │
   └────┬────┘
        │
      ┌─▼──┐
      │EDIT│
      │  Q │
      └────┘
```

---

## **FEATURE FLOW**

### 📚 **Question Bank Workflow**

```
CREATE BANK
    ↓
NAME + DESCRIPTION
    ↓
BANK CREATED
    ↓
VIEW BANK
    ↓
ADD QUESTIONS
    ├─ Question Title
    ├─ Rich Text Body
    ├─ Difficulty Level
    ├─ Question Type
    ├─ MCQ Options (if MCQ)
    └─ File Attachments
    ↓
QUESTIONS LISTED
    ├─ Edit
    └─ Delete
```

### ❓ **Question Management Workflow**

```
QUESTIONS PAGE
    ↓
SEARCH + FILTER
    ├─ Search: Title/Body
    ├─ Difficulty: All/Easy/Medium/Hard
    └─ Type: All/MCQ/Short/Long/TrueFalse
    ↓
FILTERED RESULTS
    ├─ 📋 Question Card
    │   ├─ Title
    │   ├─ Difficulty Badge (color)
    │   ├─ Type Badge
    │   └─ Edit/Delete Buttons
    └─ ...more questions
```

### 📋 **Exam Creation Workflow**

```
CREATE EXAM
    ↓
EXAM DETAILS
    ├─ Title
    └─ Duration (minutes)
    ↓
EXAM CREATED
    ↓
ADD QUESTIONS
    ├─ Select Bank
    ├─ Pick Questions
    └─ Checkbox each
    ↓
QUESTIONS ADDED
    ├─ Question List
    │   ├─ Question #1
    │   ├─ Question #2
    │   └─ ...
    ├─ Edit/Remove Options
    └─ Ready to Use
```

---

## **UI COMPONENT HIERARCHY**

```
App
├── Authentication
│   ├── Login
│   ├── Register
│   ├── ForgotPassword
│   └── ResetPassword
│
└── Layout (Protected)
    ├── Sidebar
    │   ├── Navigation Links
    │   ├── Dashboard
    │   ├── Banks
    │   ├── Questions
    │   ├── Exams
    │   └── Users
    │
    ├── Topbar
    │   ├── Search Bar
    │   └── User Menu
    │
    └── Main Content
        ├── Dashboard
        │   ├── StatCard (x3)
        │   ├── Recent Banks Grid
        │   └── Quick Stats
        │
        ├── BankList
        │   └── Bank Cards Grid
        │
        ├── BankDetail
        │   ├── Bank Info
        │   ├── Questions List
        │   └── Modal (Add Question)
        │
        ├── QuestionList
        │   ├── Search Bar
        │   ├── Filter Dropdowns
        │   └── Question Cards
        │
        ├── QuestionEditor
        │   ├── Title Input
        │   ├── Rich Text Editor
        │   ├── Difficulty Select
        │   ├── Type Select
        │   ├── MCQ Options
        │   ├── File Upload
        │   └── Save/Delete Buttons
        │
        ├── ExamList
        │   ├── Create Exam Button
        │   └── Exam Cards
        │
        └── ExamBuilder
            ├── Exam Details
            ├── Add Questions Modal
            │   ├── Bank Selector
            │   ├── Question Checkboxes
            │   └── Add Button
            └── Questions List
```

---

## **DATA FLOW**

```
USER INPUT
    ↓
FORM/COMPONENT
    ↓
AXIOS REQUEST
    ↓
API ENDPOINT
    ↓
DATABASE QUERY
    ↓
DATABASE
    ↓
QUERY RESULT
    ↓
API RESPONSE
    ↓
STATE UPDATE
    ↓
RE-RENDER
    ↓
UPDATED UI
```

---

## **Database Schema Relationships**

```
USERS (1)
  ├─→ question_banks (Many)
  │    ├─→ questions (Many)
  │    │    ├─→ question_tags (Many)
  │    │    │    └─→ tags
  │    │    └─→ exam_questions (Many)
  │    │         └─→ exams
  │    └─→ exams (Many)
  │         └─→ exam_questions (Many)
  │              └─→ questions
  └─→ refresh_tokens (Many)

KEY RELATIONSHIPS:
- User creates multiple Banks
- Bank contains multiple Questions
- Questions can be tagged (Tags)
- Questions added to Exams via exam_questions
- Each Exam has multiple Questions
- Users have Refresh Tokens for auth
```

---

## **State Management Pattern**

```
COMPONENT
    ↓
useState(data, setData)
    ↓
useEffect()
    ├─ On mount: axios.get()
    └─ Update state with response
    ↓
RENDER
    ├─ Map over state arrays
    └─ Pass props to children
    ↓
USER INTERACTION
    ├─ Click handler calls function
    ├─ Function does axios.post/patch/delete
    └─ Update state with result
    ↓
RE-RENDER with new data
```

---

## **Authentication Flow**

```
REGISTER/LOGIN PAGE
    ↓
USER ENTERS CREDENTIALS
    ↓
SUBMIT FORM
    ↓
POST /api/auth/register or /api/auth/login
    ↓
SERVER
    ├─ Hash password
    ├─ Check database
    └─ Return token
    ↓
SAVE TOKEN
    ├─ localStorage.setItem('accessToken', token)
    └─ localStorage.setItem('refreshToken', token)
    ↓
REDIRECT TO DASHBOARD
    ↓
API REQUESTS INCLUDE TOKEN
    ├─ Authorization: Bearer {token}
    └─ Header on all requests
    ↓
SERVER VALIDATES TOKEN
    ├─ If valid: Process request
    └─ If invalid: Return 401
```

---

## **Search & Filter Logic**

```
USER ENTERS SEARCH
    ↓
onChange() triggered
    ↓
UPDATE state.searchTerm
    ↓
USE EFFECT RUNS
    ↓
FILTER LOGIC
    ├─ questions.filter(q => 
    │   ├─ q.title.includes(searchTerm) OR
    │   ├─ q.body.includes(searchTerm) AND
    │   ├─ difficulty === selected OR difficulty === 'all' AND
    │   └─ type === selected OR type === 'all'
    ├─ )
    └─ setFilteredQuestions(result)
    ↓
RENDER filtered questions
```

---

## **File Upload Flow**

```
USER SELECTS FILE
    ↓
FORM DATA CREATED
    ├─ const formData = new FormData()
    └─ formData.append('file', file)
    ↓
POST /api/uploads
    ↓
SERVER (multer)
    ├─ Validates file type
    ├─ Saves to /server/uploads/
    └─ Returns filename
    ↓
ATTACH TO QUESTION
    ├─ Save attachment_url in database
    └─ Display filename to user
    ↓
CAN DOWNLOAD LATER
```

---

## **Color Code Legend**

| Color | Meaning |
|-------|---------|
| 🟣 Purple | Primary/Interactive |
| 🟢 Green | Success/Easy |
| 🟡 Amber | Warning/Medium |
| 🔴 Red | Danger/Hard/Delete |
| ⚫ Gray | Secondary/Disabled |

---

## **Responsive Breakpoints**

```
Mobile (< 768px)
├─ 1 column layout
├─ Sidebar hidden (hamburger menu)
└─ Stacked cards

Tablet (768px - 1024px)
├─ 2 column layout
├─ Sidebar visible
└─ Grid adjusts

Desktop (> 1024px)
├─ 3+ column layout
├─ Sidebar always visible
└─ Full grid
```

---

## **Performance Optimization**

```
LAZY LOADING
├─ React.lazy() for pages
└─ Suspense boundary with fallback

MEMOIZATION
├─ React.memo() for components
└─ useMemo() for expensive calculations

CODE SPLITTING
├─ Dynamic imports for routes
└─ Bundle split by page

CACHING
├─ API responses cached in state
└─ Avoid duplicate requests
```

---

That's the complete visual representation! 🎨

