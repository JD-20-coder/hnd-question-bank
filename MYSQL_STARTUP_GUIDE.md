# 🗄️ MySQL Startup Guide

## Issue:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**This means:** MySQL server is not running on your computer.

---

## ✅ SOLUTION: Start MySQL Server

### Windows 10/11 - Method 1: Using Services (Easiest)

**Step 1:** Open Services
- Press `Windows Key + R`
- Type: `services.msc`
- Press Enter

**Step 2:** Find MySQL
- Look for: `MySQL80` or `MySQL57` (depending on your version)
- Right-click on it
- Select: **Start**

**Step 3:** Verify it's running
- Status should show: **Running**
- Startup type should be: **Automatic**

---

### Windows 10/11 - Method 2: Using Command Prompt

**Open PowerShell as Administrator:**
1. Right-click Windows Start menu
2. Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
3. Run this command:

```powershell
net start MySQL80
```

**Expected output:**
```
The MySQL80 service is starting.
The MySQL80 service has been started successfully.
```

---

### Windows 10/11 - Method 3: Using Task Manager

1. Press `Ctrl + Shift + Esc` (or right-click taskbar → Task Manager)
2. Click "Services" tab
3. Find `MySQL80` or `MySQL57`
4. Right-click → Start

---

## 🔍 Verify MySQL is Running

Run this command in PowerShell:

```powershell
Get-Service | Where-Object {$_.Name -like "*mysql*"}
```

**Expected output:**
```
Status   Name                StartType
------   ----                ---------
Running  MySQL80             Automatic
```

If you don't see "Running", go back and start the service.

---

## 🧪 Test MySQL Connection

Run this command in PowerShell:

```powershell
mysql -u root -p
```

**Enter password:** (press Enter if no password, or type your password)

**You should see:**
```
mysql>
```

**Type to exit:**
```
exit
```

---

## ⚠️ If MySQL Isn't Installed

**Check:**
```powershell
mysql --version
```

**If not found:**

1. **Install MySQL:**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Choose "Windows" installer
   - Run installer and follow setup
   - Default port: `3306`
   - Default username: `root`
   - Default password: leave empty (or set one)

2. **Update .env file in server folder:**
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=  (or your password)
   ```

---

## ✅ Once MySQL is Running

Go back to your terminal and run:

```powershell
cd "c:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank\server"
npm run migrate
npm run seed
```

---

## 🚀 Common MySQL Port Issues

**If port 3306 is in use by another app:**

1. Find what's using it:
   ```powershell
   netstat -ano | findstr :3306
   ```

2. Kill the process (replace PID with the number from above):
   ```powershell
   taskkill /PID <PID> /F
   ```

3. Start MySQL again:
   ```powershell
   net start MySQL80
   ```

---

## 💡 Next Steps

**Once MySQL is running:**

1. ✅ Start MySQL (you are here)
2. Run migrations: `npm run migrate`
3. Seed test data: `npm run seed`
4. Start dev servers: `npm run dev`
5. Open browser: http://localhost:5173

---

**Status:** Blocked - Waiting for MySQL startup  
**Time to fix:** 2-5 minutes  
**Difficulty:** Easy ⭐

Once MySQL is running, reply and I'll run the remaining commands!
