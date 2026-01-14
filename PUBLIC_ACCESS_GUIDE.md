# 🌐 PUBLIC ACCESS ARCHITECTURE GUIDE

## Overview

The HND Question Bank has been restructured to support **public browsing** while maintaining **authentication-protected uploads**. This allows anyone to explore past questions without creating an account, but limits question uploads to registered users.

---

## 🎯 Architecture Design

### Public vs. Protected Routes

```
PUBLIC ROUTES (No Auth Required)
├── /                    → Home page (modern landing)
├── /home               → Alternative home access
├── /browse             → Search & browse all questions
├── /question/:id       → View individual question details
├── /api/public/*       → All public API endpoints

PROTECTED ROUTES (Auth Required)
├── /dashboard          → User dashboard
├── /banks              → User's question banks
├── /banks/:id/edit     → Edit bank (owner only)
├── /questions/:id      → Edit question (author only)
├── /exams              → Create/manage exams
```

---

## 📊 Data Model Changes

### New Field Added to question_banks Table

```sql
ALTER TABLE question_banks ADD COLUMN is_public BOOLEAN DEFAULT false;
ALTER TABLE question_banks ADD COLUMN field_of_study VARCHAR(100);
ALTER TABLE question_banks ADD COLUMN question_count INT DEFAULT 0;
```

### Key Relationships

- **question_banks** → One bank can contain many questions
- **questions** → Linked to banks via `bank_id`
- **field_of_study** → Categories like "Engineering", "Science", "Management", etc.

---

## 🔌 Public API Endpoints

### 1. Get All Fields of Study
```
GET /api/public/fields

Response:
{
  "fields": [
    { "field_of_study": "Engineering" },
    { "field_of_study": "Science" },
    { "field_of_study": "Business" }
  ]
}
```

### 2. Get Banks by Field
```
GET /api/public/banks/by-field/:field?limit=20&offset=0

Example:
GET /api/public/banks/by-field/Engineering?limit=20&offset=0

Response:
{
  "banks": [
    {
      "id": 1,
      "title": "Electrical Engineering 2024",
      "description": "Past examination questions",
      "field_of_study": "Engineering",
      "question_count": 45
    }
  ]
}
```

### 3. Search Questions
```
GET /api/public/questions/search?q=circuit&field=Engineering&type=mcq&difficulty=hard&limit=50&offset=0

Query Parameters:
- q: Search keyword (optional)
- field: Field of study (optional)
- type: mcq|short|long|truefalse (optional)
- difficulty: easy|medium|hard (optional)
- limit: Results per page (default: 50)
- offset: Pagination offset (default: 0)

Response:
{
  "items": [
    {
      "id": 1,
      "title": "Ohm's Law Calculation",
      "body": "<p>Calculate voltage across resistor...</p>",
      "type": "mcq",
      "difficulty": "medium",
      "field_of_study": "Engineering",
      "bank_title": "Electrical Engineering 2024",
      "created_at": "2026-01-14T10:30:00Z"
    }
  ]
}
```

### 4. Get Question Details
```
GET /api/public/questions/:id

Response:
{
  "question": {
    "id": 1,
    "title": "Ohm's Law Calculation",
    "body": "<p>Question content...</p>",
    "answer": "<p>Answer content...</p>",
    "type": "mcq",
    "difficulty": "medium",
    "field_of_study": "Engineering",
    "bank_title": "Bank Name",
    "attachments": [
      { "name": "diagram.pdf", "url": "/uploads/..." }
    ],
    "created_at": "2026-01-14T10:30:00Z"
  }
}
```

### 5. Get Bank Details
```
GET /api/public/banks/:id

Response:
{
  "bank": {
    "id": 1,
    "title": "Electrical Engineering 2024",
    "description": "...",
    "field_of_study": "Engineering",
    "question_count": 45
  },
  "questions": [
    { "id": 1, "title": "...", "type": "mcq", "difficulty": "medium" }
  ]
}
```

### 6. Get System Statistics
```
GET /api/public/stats

Response:
{
  "banks": 150,
  "questions": 5432,
  "users": 342,
  "fields": 12
}
```

---

## 🖼️ Frontend Pages

### Home Page (`/pages/Home.tsx`)

**Features:**
- Hero section with site tagline and call-to-action
- Search bar to find questions quickly
- Statistics showing site metrics
- Grid of field categories with click-to-browse
- Feature highlights section
- Sign-up prompt for contributors
- Responsive design for all devices

**Key Sections:**
```
┌────────────────────────────────────┐
│  Logo  [Search...] [Register]      │ ← Header (conditional)
├────────────────────────────────────┤
│                                    │
│  HND Question Bank                 │
│  Access thousands of past...       │
│                                    │
│  [Search Box]  [Browse] [Register] │
│                                    │
├────────────────────────────────────┤
│  Statistics: 5432 Q | 150 Banks   │
├────────────────────────────────────┤
│  Fields of Study                   │
│  [Engineering] [Science] [Business] │
├────────────────────────────────────┤
│  Features (4 cards)                │
├────────────────────────────────────┤
│  Ready to Upload?  [Register CTA]  │
└────────────────────────────────────┘
```

### Browse Page (`/pages/Browse.tsx`)

**Features:**
- Sidebar with advanced filters
- Question grid with cards
- Search by keyword, field, type, difficulty
- Pagination for large result sets
- Quick view preview of questions
- Sign-up CTA for uploads

**Filter Options:**
- Search keyword (full-text)
- Field of study (dropdown)
- Question type (MCQ, Short, Long, True/False)
- Difficulty (Easy, Medium, Hard)

**Each Question Card Shows:**
- Question type icon
- Difficulty badge (color-coded)
- Question title
- Preview of question body (100 chars)
- Bank name and field tag
- "View Question →" action

### Question Detail Page (`/pages/question/:id`)

**Features:**
- Full question display with formatting
- Answer section (toggle to show/hide)
- Attachments section with download links
- Metadata sidebar (field, difficulty, bank, type)
- Related questions suggestions
- Sign-up prompt for contributors

**Sections:**
```
Back Button
Meta Tags: [Field] [Difficulty] [Type]
Created: January 14, 2026

╔════════════════════════════════╗
║  Question Title                ║
╠════════════════════════════════╣
║  QUESTION                      ║
║  [Full question content...]    ║
├────────────────────────────────┤
║  ANSWER  [Show/Hide]           ║
║  [Answer toggles here]         ║
╠════════════════════════════════╣
║  ATTACHMENTS                   ║
║  📄 diagram.pdf ↓              ║
╠════════════════════════════════╣
║  ABOUT THIS QUESTION           ║ ← Sidebar
║  Field: Engineering            │
║  Bank: EE 2024                 │
║  Difficulty: Medium            │
║  Type: Multiple Choice         │
├────────────────────────────────┤
║  💡 TIP: Read carefully...     │
│
║  🚀 WANT TO UPLOAD?            │
║  [Create Account] [Login]      │
└────────────────────────────────┘
```

---

## 🗄️ Database Initialization

### Migration Files

**003_public_access.sql** - Contains:
- `ALTER` statements to add new columns
- Indexes for search performance
- View for bank statistics

### Running Migrations

```bash
# From server directory
npm run migrate

# This will execute all .sql files in migrations/ folder
```

### Required Fields for Public Questions

When creating a question, instructor must set:
```
- title (required)
- body (required)
- bank_id (required)
- field_of_study (auto-filled from bank)
- type (mcq|short|long|truefalse)
- difficulty (easy|medium|hard)
```

---

## 👥 User Flow Comparison

### Anonymous User (Public Browser)
```
1. Visit website → Home page
2. Browse all questions by field
3. Search questions by keyword
4. View question details & answers
5. See "Register to Upload" prompt
6. Click → Register page
```

### Registered User (Contributor)
```
1. Login with credentials
2. Access Dashboard
3. Create Question Bank (set field_of_study, is_public)
4. Add questions to bank
5. Manage banks and questions
6. Delete/Edit own content
7. Create exams from questions
```

### Admin
```
1. Login as admin
2. View all users & banks
3. Delete inappropriate content
4. Manage system settings
5. View analytics
```

---

## 🔐 Security & Permissions

### Public Access Rules
```
✅ Anyone can:
  - View all public questions
  - Search by any criteria
  - Download attachments
  - Register for account

❌ Only authenticated users can:
  - Create question banks
  - Upload questions
  - Create exams
  - Edit own content

❌ Only admins can:
  - Delete any content
  - View user reports
  - Manage system
```

### Authorization Checks

**For Question Upload:**
```typescript
// Protected route with authMiddleware
POST /api/questions
- Requires: Valid JWT token
- Checks: req.user.id must match author
```

**For Bank Creation:**
```typescript
// Protected route
POST /api/banks
- Requires: Valid JWT token
- Checks: User role is instructor/admin
```

---

## 📱 Responsive Design

### Breakpoints
- **Desktop** (1024px+): Sidebar + Main + Sidebar layout
- **Tablet** (768px-1023px): Single column, filters accordion
- **Mobile** (< 768px): Full-width, filters collapsed

### Mobile Optimizations
- Touch-friendly buttons (48px minimum)
- Readable font sizes (16px base)
- Optimized images and lazy loading
- Vertical layout for filters

---

## 🎨 UI/UX Features

### Modern Dark Theme
- Base: #0f172a (very dark blue)
- Surface: #1a202c, rgba(30, 41, 59, 0.6)
- Accent: #3b82f6 (bright blue)
- Text: #e2e8f0 (light gray), #cbd5e1 (muted)

### Interactive Elements
- Hover states with smooth transitions
- Color-coded difficulty badges
  - Easy: #10b981 (green)
  - Medium: #f59e0b (amber)
  - Hard: #ef4444 (red)
- Loading spinners and skeletons
- Smooth page transitions

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast WCAG AA compliant

---

## 🚀 Deployment Checklist

Before going live, ensure:

- [ ] All migrations run successfully
- [ ] Test public browsing without auth
- [ ] Verify search filters work
- [ ] Test question detail pages
- [ ] Check responsive design on mobile
- [ ] Verify API endpoints return correct data
- [ ] Test auth redirect on edit/delete
- [ ] Set environment variables
- [ ] Run security checks
- [ ] Performance test (< 2s load time)
- [ ] Test file uploads for attachments
- [ ] Verify email notifications (if enabled)
- [ ] Setup database backups
- [ ] Monitor error logs

---

## 📊 Analytics & Metrics

**Recommended Tracking:**
- Page views (Home, Browse, Question Detail)
- Search queries (popular topics)
- User registrations
- Question uploads per field
- Most viewed questions
- Time on page
- Device/browser analytics

---

## 🐛 Troubleshooting

### Issue: Questions not showing on public browsing

**Solution:** Check if `question_banks.is_public = true`

```sql
UPDATE question_banks SET is_public = true WHERE id = 1;
```

### Issue: Search not returning results

**Solution:** Verify indexes exist:

```sql
SHOW INDEX FROM question_banks;
SHOW INDEX FROM questions;
```

### Issue: Attachments not loading

**Solution:** Check uploads directory path and permissions:

```bash
ls -la server/uploads/
chmod 755 server/uploads/
```

### Issue: Statistics showing wrong numbers

**Solution:** Update view:

```sql
DROP VIEW bank_stats;
CREATE VIEW bank_stats AS
SELECT COUNT(*) as total_banks FROM question_banks WHERE is_public = true;
```

---

## 📖 For Developers

### Adding a New Field Category

1. **Database:**
```sql
INSERT INTO question_banks (title, field_of_study, is_public) 
VALUES ('New Bank', 'New Field', true);
```

2. **Frontend:** Automatically loads from `/api/public/fields`

### Customizing the Home Page

Edit `client/src/pages/Home.tsx`:
- Modify hero text
- Change statistics display
- Update feature cards
- Adjust CTA buttons

### Styling Updates

All CSS files support dark theme variables:
```css
--bg-primary: #0f172a;
--bg-surface: #1a202c;
--accent-color: #3b82f6;
--text-primary: #e2e8f0;
```

---

## ✅ Feature Checklist

- ✅ Public home page with hero section
- ✅ Browse all questions without auth
- ✅ Search with multiple filters
- ✅ Question detail view with answer toggle
- ✅ Field of study categorization
- ✅ Responsive design for mobile
- ✅ Pagination for large result sets
- ✅ Statistics dashboard
- ✅ Auth-protected uploads
- ✅ Admin content management
- ✅ Modern UI with dark theme
- ✅ Fast search performance
- ✅ File attachment support

---

**Last Updated:** January 14, 2026  
**Version:** 2.0 (Public Access)  
**Status:** Ready for Production

For questions or support, refer to the main README.md or contact the development team.
