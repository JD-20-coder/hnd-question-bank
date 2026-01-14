# 🔧 MySQL Connection Troubleshooting

## Issue Detected:
MySQL service is running, but the Node.js application cannot connect to it on port 3306.

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**What we found:**
- ✅ MySQL80 service is running
- ✅ mysqld processes exist (2 processes found)
- ❌ Port 3306 is NOT listening
- ✅ Port 33060 (X Protocol) is listening

---

## Solution Options:

### Option 1: Restart MySQL Service (Admin Required)

**Open Command Prompt as Administrator:**

1. Right-click Start menu
2. Select "Command Prompt (Admin)" or "PowerShell (Admin)"
3. Run these commands:

```batch
net stop MySQL80
timeout /t 5
net start MySQL80
timeout /t 10
```

**Then try migration again:**
```powershell
Push-Location "C:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank\server"
npm run migrate
Pop-Location
```

---

### Option 2: Check MySQL Error Log

Find MySQL installation error logs:

```powershell
# Typical location for MySQL80
Get-ChildItem "C:\ProgramData\MySQL\MySQL Server 8.0\Data" -Filter "*.err" | Select-Object FullName, LastWriteTime
```

Then check the most recent error log to see what's preventing MySQL from starting port 3306.

---

### Option 3: Reinstall MySQL (Last Resort)

If Options 1 & 2 don't work:

1. **Uninstall MySQL:**
   - Control Panel → Programs → Uninstall a program
   - Find "MySQL Server 8.0"
   - Click Uninstall
   - Remove all MySQL files

2. **Reinstall MySQL:**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Run the installer
   - Choose "Server only"
   - Use default configuration
   - Port: 3306
   - Username: root
   - Password: (leave empty)

3. **Update .env:**
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=hnd_question_bank
   ```

---

### Option 4: Use Docker (If Installed)

If you have Docker installed, you can run MySQL in a container:

```powershell
docker run --name mysql-hnd -e MYSQL_ROOT_PASSWORD= -e MYSQL_DATABASE=hnd_question_bank -p 3306:3306 -d mysql:8.0

# Then wait 10 seconds and run migration
Start-Sleep -Seconds 10
npm run migrate
```

---

## Quick Verification Script

Run this to diagnose the exact issue:

```powershell
# 1. Check service status
Write-Host "1. Service Status:"
Get-Service MySQL80 | Select-Object Status, Name

# 2. Check process status  
Write-Host "2. Process Status:"
Get-Process mysqld -ErrorAction SilentlyContinue | Select-Object ProcessName, Id

# 3. Check listening ports
Write-Host "3. Listening Ports:"
Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -in (3306, 33060)} | Select-Object LocalPort

# 4. Try connection
Write-Host "4. Connection Test:"
$ErrorActionPreference = 'SilentlyContinue'
$connection = [System.Net.Sockets.TcpClient]::new()
$connection.Connect("127.0.0.1", 3306)
if ($connection.Connected) { Write-Host "✅ Connected to port 3306" } else { Write-Host "❌ Cannot connect to port 3306" }
$connection.Close()
```

---

## 🚀 After Fixing MySQL

Once MySQL is properly connected, run:

```powershell
cd "C:\Users\deppj\Desktop\B-TECH DOCS\Eka Amstrome Zeba\hnd-question-bank\server"
npm run migrate
npm run seed
cd ..
npm run dev
```

---

## 📞 Still Having Issues?

**Try this diagnostic:**

Save as `test-mysql.js` and run:

```javascript
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: ''
    });
    console.log('✅ Connected to MySQL!');
    await connection.end();
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error:', error.code);
    console.log('Message:', error.message);
  }
})();
```

Run with:
```powershell
node test-mysql.js
```

---

**Next Step:** Try **Option 1** above (restart MySQL service with Admin rights)

Then let me know the result and I'll run the remaining commands!
