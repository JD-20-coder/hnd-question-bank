# System Architecture Diagram

## User Access Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WEBSITE VISITOR                             │
│                                                                     │
│  Visit: http://localhost:5173 or https://your-domain.vercel.app   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   HOME PAGE (/)     │
                    │  Shows statistics   │
                    │  Browse options     │
                    │  Search bar         │
                    │  Call-to-action     │
                    └──────┬──────┬───────┘
                           │      │
                ┌──────────┘      └──────────┐
                │                            │
        ┌───────▼────────┐         ┌────────▼──────┐
        │ Browse (/browse)         │ Register      │
        │                          │ (/register)   │
        │ • Filter by field        │               │
        │ • Search keywords        │ Create        │
        │ • Filter by type         │ Account       │
        │ • Filter difficulty      │               │
        │ • See cards              │ ↓             │
        │                          │ Login         │
        │ ↓                        │ (/login)      │
        │                          │               │
        │ Click card               │ ↓             │
        │ ↓                        │ Dashboard     │
        │                          │ (/dashboard)  │
        └───────┬────────┐        └──┬────────────┘
                │        │           │
        ┌───────▼────────▼───────────▼────────┐
        │  Question Detail (/question/:id)    │
        │                                    │
        │  • Full question text              │
        │  • Answer (toggle to show)         │
        │  • Attachments                     │
        │  • Metadata                        │
        │  • Related questions               │
        └────────────────────────────────────┘
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       CLIENT (React)                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Pages (Lazy Loaded)                        │   │
│  │  • Home.tsx - Landing page with hero                   │   │
│  │  • Browse.tsx - Search and filter                      │   │
│  │  • QuestionDetail.tsx - View details                   │   │
│  │  • Dashboard.tsx - User profile (auth only)            │   │
│  │  • BankEdit.tsx - Create/edit banks (auth only)        │   │
│  │  • QuestionEditor.tsx - Upload questions (auth only)   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ▲                                   │
│  Axios Interceptor ◄────────┤                                   │
│  - Adds JWT Token            │                                   │
│  - Refreshes on 401          │                                   │
│                              │                                   │
│                     ┌────────▼─────────────────────┐            │
│                     │  API Calls (axios)           │            │
│                     │                              │            │
│                     │  GET  /api/public/fields     │            │
│                     │  GET  /api/public/banks/:id  │            │
│                     │  GET  /api/public/questions  │            │
│                     │  POST /api/banks             │            │
│                     │  POST /api/questions         │            │
│                     │  ...more                     │            │
│                     └────────┬─────────────────────┘            │
└──────────────────────────────┼──────────────────────────────────┘
                               │ HTTPS/REST
┌──────────────────────────────▼──────────────────────────────────┐
│                     SERVER (Node.js)                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Express.js Routes                           │   │
│  │                                                        │   │
│  │  PUBLIC ROUTES (No Auth)                              │   │
│  │  ├─ GET /api/public/fields                           │   │
│  │  ├─ GET /api/public/banks/by-field/:field           │   │
│  │  ├─ GET /api/public/questions/search                │   │
│  │  ├─ GET /api/public/questions/:id                   │   │
│  │  ├─ GET /api/public/banks/:id                       │   │
│  │  └─ GET /api/public/stats                           │   │
│  │                                                        │   │
│  │  AUTH ROUTES (Public, handles JWT)                   │   │
│  │  ├─ POST /api/auth/register                         │   │
│  │  ├─ POST /api/auth/login                            │   │
│  │  ├─ POST /api/auth/refresh                          │   │
│  │  └─ POST /api/auth/forgot-password                  │   │
│  │                                                        │   │
│  │  PROTECTED ROUTES (Auth + Middleware)               │   │
│  │  ├─ POST   /api/banks                               │   │
│  │  ├─ PUT    /api/banks/:id                           │   │
│  │  ├─ DELETE /api/banks/:id                           │   │
│  │  ├─ POST   /api/questions                           │   │
│  │  ├─ PUT    /api/questions/:id                       │   │
│  │  ├─ DELETE /api/questions/:id                       │   │
│  │  ├─ POST   /api/exams                               │   │
│  │  └─ ...more                                          │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │       Middleware & Controllers                      │   │
│  │                                                     │   │
│  │  • authMiddleware.ts - JWT verification           │   │
│  │  • validate.ts - Input validation                 │   │
│  │  • Models - Database operations                   │   │
│  │    ├─ user.ts                                     │   │
│  │    ├─ question.ts                                 │   │
│  │    └─ questionBank.ts                             │   │
│  └──────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────┘
                               │ MySQL Driver (mysql2/promise)
┌──────────────────────────────▼──────────────────────────────────┐
│                    MYSQL DATABASE                               │
│                                                                  │
│  Tables:                                                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  users                                                 │  │
│  │  ├─ id, email, password_hash, role                    │  │
│  │  ├─ created_at, updated_at                            │  │
│  │  └─ is_verified                                       │  │
│  │                                                        │  │
│  │  question_banks                                       │  │
│  │  ├─ id, title, description, owner_id                │  │
│  │  ├─ is_public (NEW) ◄─── Controls visibility        │  │
│  │  ├─ field_of_study (NEW) ◄─ Category               │  │
│  │  ├─ question_count (NEW) ◄─ Denormalized count     │  │
│  │  └─ created_at, updated_at                          │  │
│  │                                                        │  │
│  │  questions                                           │  │
│  │  ├─ id, bank_id, author_id, title, body             │  │
│  │  ├─ answer, type, difficulty, attachments           │  │
│  │  └─ created_at, updated_at                          │  │
│  │                                                        │  │
│  │  exams & exam_questions (Junction)                  │  │
│  │  └─ exam_id, question_id                            │  │
│  │                                                        │  │
│  │  Indexes (for performance):                          │  │
│  │  • idx_field_of_study - Fast filtering             │  │
│  │  • idx_is_public - Public questions only            │  │
│  │  • idx_question_type - Type filtering              │  │
│  │  • idx_question_difficulty - Difficulty filter      │  │
│  │  • idx_bank_id - Quick lookups                      │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Request/Response Cycle Example

### Example 1: Public Question Search

```
USER BROWSER                    SERVER                    DATABASE
    │                            │                           │
    ├─ GET /api/public/         ►│                           │
    │  questions/search          │                           │
    │  ?q=circuit&field=Eng      │                           │
    │                            ├──► SELECT * FROM questions Q
    │                            │    JOIN question_banks QB
    │                            │    WHERE QB.is_public=true
    │                            │    AND Q.title LIKE '%circuit%'
    │                            │    AND QB.field_of_study='Eng'  │
    │                            │                           │
    │                            │◄─── Result: 23 questions │
    │                            │                           │
    │◄─ {items: [...]}           │                           │
    │   200 OK                   │                           │
    │                            │                           │
    └─ Render search results     │                           │
       in Browse page            │                           │
```

### Example 2: Authenticated Question Upload

```
USER BROWSER                    SERVER                    DATABASE
    │                            │                           │
    ├─ POST /api/questions      ►│                           │
    │  { title, body, bankId }   │                           │
    │  + JWT Token in header     │                           │
    │                            ├─ Verify JWT              │
    │                            │  Get user from token     │
    │                            │  Check authorization     │
    │                            │                           │
    │                            ├──► INSERT INTO questions  │
    │                            │    (bankId, authorId,    │
    │                            │     title, body, ...)   │
    │                            │                           │
    │                            │◄─── Question ID: 1234    │
    │                            │                           │
    │◄─ { id: 1234 }             │                           │
    │   201 Created              │                           │
    │                            │                           │
    └─ Redirect to dashboard     │                           │
       Show success message      │                           │
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTPS/TLS                               │
│                 (Encryption in transit)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  CORS Configuration                         │
│            (Prevent unauthorized cross-origin)              │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 JWT Authentication                          │
│        (Token verification, expiration checking)            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Authorization Middleware                       │
│    (Role-based access control, ownership checks)           │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Input Validation                               │
│        (Type checking, sanitization, filtering)             │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│          SQL Injection Prevention                           │
│           (Parameterized queries, escaping)                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Database (MySQL)                               │
│        (Encrypted passwords, secure storage)                │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│              https://your-domain.vercel.app                 │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼─────────────────────────────────────┐
│                  VERCEL EDGE NETWORK                         │
│         (Global CDN for static assets)                       │
│                                                              │
│  Serves:                                                     │
│  • index.html                                              │
│  • CSS files (Home.css, Browse.css, QuestionDetail.css)   │
│  • JavaScript bundles (lazy-loaded)                       │
│  • Images and static assets                               │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼─────────────────────────────────────┐
│                 VERCEL SERVERLESS                           │
│                  NODE.JS RUNTIME                             │
│         (Express.js server with API routes)                 │
│                                                              │
│  Runs:                                                       │
│  • server/dist/index.js (compiled TypeScript)              │
│  • All /api/* endpoints                                     │
│  • Authentication & authorization logic                    │
└────────────────────────┬─────────────────────────────────────┘
                         │ TCP/IP
┌────────────────────────▼─────────────────────────────────────┐
│              EXTERNAL DATABASE SERVICE                       │
│                  (PlanetScale MySQL)                         │
│                    or on-premises MySQL                     │
│                                                              │
│  Stores:                                                     │
│  • All question bank data                                  │
│  • User accounts                                           │
│  • Questions and exams                                     │
│  • Session/refresh tokens                                  │
└──────────────────────────────────────────────────────────────┘
```

## Component Hierarchy (React)

```
App
├── AppHeader
│   ├── Logo
│   ├── Search (conditional)
│   └── Auth Buttons
│
├── Routes
│   │
│   ├── Public Routes (No Auth)
│   │   ├── Home
│   │   │   ├── Hero Section
│   │   │   ├── SearchBar
│   │   │   ├── Stats Grid
│   │   │   ├── Fields Grid
│   │   │   ├── Features
│   │   │   └── SignUp CTA
│   │   │
│   │   ├── Browse
│   │   │   ├── FilterSidebar
│   │   │   │   ├── SearchInput
│   │   │   │   ├── FieldSelect
│   │   │   │   ├── TypeSelect
│   │   │   │   └── DifficultySelect
│   │   │   ├── QuestionsList
│   │   │   │   ├── QuestionCard
│   │   │   │   │   ├── TypeIcon
│   │   │   │   │   ├── DifficultyBadge
│   │   │   │   │   ├── Preview
│   │   │   │   │   └── Action
│   │   │   │   └── Pagination
│   │   │   └── SignUp CTA
│   │   │
│   │   ├── QuestionDetail
│   │   │   ├── BackButton
│   │   │   ├── MetaInfo
│   │   │   ├── QuestionBody
│   │   │   ├── AnswerSection (toggle)
│   │   │   ├── AttachmentsSection
│   │   │   ├── Sidebar
│   │   │   │   ├── AboutCard
│   │   │   │   ├── TipCard
│   │   │   │   └── SignUpCard
│   │   │   └── RelatedSection
│   │   │
│   │   ├── Login
│   │   ├── Register
│   │   └── ForgotPassword
│   │
│   └── Protected Routes (Auth Required)
│       ├── PrivateRoute (Wrapper)
│       ├── Dashboard
│       ├── BankList
│       ├── BankEdit
│       ├── QuestionList
│       ├── QuestionEditor
│       ├── ExamList
│       └── ExamBuilder
│
└── Routes (404 catch-all)
    └── NotFound Page
```

---

**System Architecture Version:** 2.0  
**Last Updated:** January 14, 2026  
**Status:** Production-Ready
