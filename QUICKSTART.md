# 🚀 QUICK START - Run This Application

## ✅ What You Have

A complete **Accessibility Helper for Dyslexia** application with 65+ files ready to run!

---

## ⚠️ IMPORTANT: One-Time Setup Required

**Node.js is installed but not yet recognized by your current terminal.**

### Fix This Now (Choose ONE):

**Option 1: Restart VS Code** (Recommended)
1. Close ALL VS Code windows
2. Reopen VS Code
3. Open integrated terminal
4. Continue to "Run Application" below

**Option 2: Open New Terminal**
1. Press `Win + X`
2. Choose "Windows PowerShell" or "Terminal"
3. Navigate: `cd "e:\helper for dyslexia"`
4. Continue to "Run Application" below

**Option 3: Restart Computer**
- Guarantees Node.js is in PATH
- Then continue to "Run Application" below

---

## 🎯 Run Application (After Fix Above)

### Automatic Startup (Easiest):

Double-click: **`START.bat`** in `e:\helper for dyslexia\`

The script will automatically:
- ✅ Install all dependencies
- ✅ Start MongoDB (if Docker available)
- ✅ Seed database with demo users
- ✅ Start backend server (port 5000)
- ✅ Start frontend server (port 3000)
- ✅ Open browser to http://localhost:3000

### Or Run Manually:

**Terminal 1 - Backend:**
```powershell
cd "e:\helper for dyslexia\backend"
npm install           # Only needed first time
npm run seed          # Creates demo users
npm run dev           # Starts backend on port 5000
```

**Terminal 2 - Frontend:**
```powershell
cd "e:\helper for dyslexia\frontend"
python -m http.server 3000   # Starts frontend on port 3000
```

**Browser:**
Open: http://localhost:3000

---

## 🔑 Demo Login Credentials

**Regular User:**
- Email: `user@example.com`
- Password: `User123!`

**Admin User:**
- Email: `admin@example.com`
- Password: `Admin123!`

---

## 📦 What's Installed

### Backend (Express API)
- ✅ User authentication (JWT)
- ✅ Document upload (PDF/TXT)
- ✅ Preferences management
- ✅ Analytics tracking
- ✅ MongoDB database

### Frontend (Vanilla JS)
- ✅ Text formatting controls
- ✅ Syllable splitting
- ✅ Text-to-speech with highlighting
- ✅ Color overlays
- ✅ PDF extraction
- ✅ Document management
- ✅ User dashboard

---

## 🐛 Troubleshooting

### "npm: command not found"
**Solution:** You're in an old terminal. Restart VS Code or open new terminal.

### "MongoDB connection failed"
**Options:**
1. Install Docker and run: `docker run -d -p 27017:27017 --name mongodb mongo:6.0`
2. Install MongoDB Community: https://www.mongodb.com/try/download/community
3. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Backend won't start
1. Check `.env` file exists in `backend/` folder
2. Verify MongoDB is running: `docker ps` or check MongoDB Compass
3. Check port 5000 is not in use: `netstat -ano | findstr :5000`

### Frontend won't start
1. Check port 3000 is available
2. Try different port: `python -m http.server 8080`
3. Or use: `npx http-server -p 3000`

### Nothing happens when I run commands
**You need to restart your terminal first!** Node.js won't work until PATH is refreshed.

---

## 📚 Full Documentation

- **README.md** - Complete project overview
- **docs/DEPLOYMENT.md** - Deploy to production (MongoDB Atlas, Render, Netlify)
- **docs/TROUBLESHOOTING.md** - Detailed troubleshooting guide
- **docs/QUICK_START.md** - Development scripts
- **CONTRIBUTING.md** - How to contribute
- **PROJECT_COMPLETE.md** - Full project summary

---

## 🎉 Once Running

1. Visit: http://localhost:3000
2. Click "Login"
3. Use demo credentials above
4. Try these features:
   - Upload a PDF or TXT file
   - Paste text and format it
   - Enable syllable splitting
   - Try text-to-speech
   - Change fonts and colors
   - Save your preferences
   - View your documents dashboard

---

## ⏭️ Next Steps

**For Local Testing:**
1. Restart terminal (if commands don't work)
2. Run `START.bat`
3. Test all features

**For Production Deployment:**
1. Follow: **docs/DEPLOYMENT.md**
2. Set up MongoDB Atlas
3. Deploy backend to Render
4. Deploy frontend to Netlify

---

**Need Help?** Check **docs/TROUBLESHOOTING.md**

**Ready to deploy?** See **docs/DEPLOYMENT.md**

---

🚀 **The app is complete and waiting for you to run it!**
