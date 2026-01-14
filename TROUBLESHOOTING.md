# 🔧 TROUBLESHOOTING GUIDE

Quick solutions to common problems.

---

## 🌐 **Connection Issues**

### ❌ Error: "Cannot reach http://localhost:4000"

**Cause:** Backend server is not running

**Solution:**
```powershell
# Open new terminal and run:
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"
npm run dev

# You should see: "Server running on http://localhost:4000"
```

---

### ❌ Error: "Cannot reach http://localhost:5173"

**Cause:** Frontend dev server is not running

**Solution:**
```powershell
# Open new terminal and run:
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client"
npm run dev

# You should see: "Local: http://localhost:5173/"
```

---

## 🗄️ **Database Issues**

### ❌ Error: "ER_ACCESS_DENIED_FOR_USER"

**Cause:** MySQL password is wrong or service isn't running

**Solution:**
```powershell
# 1. Start MySQL service
net start MySQL80

# 2. Test connection
mysql -u root -p
# Enter password: root

# 3. If connection fails, MySQL needs to be installed
# Download from: https://dev.mysql.com/downloads/mysql/
```

---

### ❌ Error: "ECONNREFUSED 127.0.0.1:3306"

**Cause:** MySQL is not running

**Solution:**
```powershell
# Windows Service approach:
# 1. Open Services app (services.msc)
# 2. Find "MySQL80" or "MySQL57"
# 3. Right-click → Start

# OR use command:
net start MySQL80
```

---

### ❌ Error: "ER_BAD_DB_ERROR" or "Unknown database"

**Cause:** Database wasn't created during setup

**Solution:**
```powershell
# Rerun setup script to create database:
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank"
.\setup.ps1

# Or manually create:
mysql -u root -p < server/migrations/001_initial.sql
```

---

## 📦 **npm/Node Issues**

### ❌ Error: "npm: command not found"

**Cause:** Node.js not installed

**Solution:**
1. Download from https://nodejs.org/ (LTS version)
2. Run installer
3. Restart terminal
4. Verify: `node --version`

---

### ❌ Error: "ERR_MODULE_NOT_FOUND"

**Cause:** Dependencies not installed

**Solution:**
```powershell
# Install dependencies:
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client"
npm install

cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server"
npm install
```

---

### ❌ Error: "node_modules permission denied"

**Cause:** Permission issue (rarely happens)

**Solution:**
```powershell
# Remove node_modules and reinstall:
rm -r node_modules
npm install
```

---

## 🔐 **Authentication Issues**

### ❌ Error: "Invalid token" or "Token expired"

**Cause:** Access token is invalid or expired

**Solution:**
```powershell
# Clear browser storage and login again:
# 1. Open browser DevTools (F12)
# 2. Go to Application tab
# 3. Clear Local Storage
# 4. Reload page
# 5. Login again
```

---

### ❌ Can't login - "Invalid credentials"

**Cause:** User doesn't exist or password is wrong

**Solution:**
1. Click "Register" instead
2. Create new account
3. Login with new account

OR use test account:
- Email: `test@example.com`
- Password: `password123`

---

## 🎨 **UI/Frontend Issues**

### ❌ Page is blank or showing "Loading..."

**Cause:** Frontend can't reach backend

**Solution:**
1. Check backend is running: `npm run dev` in server folder
2. Check `.env` file: `VITE_API_BASE=http://localhost:4000/api`
3. Open DevTools (F12) and check Console for errors

---

### ❌ Styling looks broken (no dark theme)

**Cause:** CSS not loaded properly

**Solution:**
```powershell
# Restart frontend dev server:
# 1. Press Ctrl+C in frontend terminal
# 2. Run: npm run dev
# 3. Refresh browser (Ctrl+R)
```

---

### ❌ Icons not showing (only boxes)

**Cause:** React Icons not installed

**Solution:**
```powershell
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client"
npm install react-icons
```

---

## 🔍 **Search/Filter Not Working**

### ❌ Search doesn't filter questions

**Cause:** API call failed or data not loading

**Solution:**
1. Open DevTools (F12)
2. Go to Network tab
3. Type in search
4. Check if `/questions` API call succeeds
5. If fails, check backend logs

---

## 📝 **File Upload Issues**

### ❌ "Failed to upload file" error

**Cause:** Upload directory doesn't exist or permissions wrong

**Solution:**
```powershell
# Create uploads directory:
mkdir "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server\uploads"

# Restart backend:
npm run dev
```

---

## ⚡ **Performance Issues**

### ❌ Page loads slowly

**Cause:** Large question list loading

**Solution:**
1. Use search to narrow results
2. Apply filters (difficulty/type)
3. Paginate if implemented

---

### ❌ "Too many API calls" error

**Cause:** Frontend making duplicate requests

**Solution:**
```powershell
# Restart dev servers:
# 1. Stop client: Ctrl+C
# 2. Stop server: Ctrl+C
# 3. npm run dev (in each folder)
```

---

## 🔄 **CORS Errors**

### ❌ "Access-Control-Allow-Origin" error

**Cause:** Backend not allowing frontend requests

**Solution:**

Check `server/src/index.ts` has CORS configured:

```typescript
import cors from 'cors';
app.use(cors());
```

If missing, it's already in the code. Restart backend.

---

## 📋 **Quick Reset**

### 🔄 Reset Everything to Fresh State

```powershell
# 1. Stop both servers (Ctrl+C in both terminals)

# 2. Delete caches
rm -r "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\client\node_modules"
rm -r "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank\server\node_modules"

# 3. Clear browser cache (F12 → Application → Clear All)

# 4. Reinstall
cd "C:\Users\deppj\Desktop\B-TECH DOCS\hnd-question-bank"
.\setup.ps1

# 5. Start servers again
```

---

## 🆘 **Still Having Issues?**

### Check These First:

1. ✅ Is terminal at correct directory? (`pwd`)
2. ✅ Is backend running? (Check port 4000)
3. ✅ Is MySQL running? (`net start MySQL80`)
4. ✅ Is frontend running? (Check port 5173)
5. ✅ Check browser console: F12 → Console tab
6. ✅ Check server logs in terminal

### Common Error Codes:

| Code | Meaning | Fix |
|------|---------|-----|
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `ECONNREFUSED` | Can't connect to server | Start backend server |
| `ER_ACCESS_DENIED` | Database password wrong | Check MySQL credentials |
| `ENOENT` | File/folder not found | Check file path |
| `CORS` | Backend not allowing requests | Restart both servers |
| `404` | Endpoint doesn't exist | Check API routes |
| `401` | Not authenticated | Login again |
| `403` | Not authorized | Check user permissions |
| `500` | Server error | Check server logs |

---

## 📞 **Getting Help**

If you still need help:

1. Check the browser console (F12 → Console)
2. Check the terminal output of backend
3. Make sure all services are running
4. Verify paths are correct
5. Try the "Quick Reset" section above

