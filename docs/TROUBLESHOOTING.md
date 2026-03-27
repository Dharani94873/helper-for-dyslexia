# Troubleshooting Guide

Common issues and their solutions for the Accessibility Helper for Dyslexia application.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Database Issues](#database-issues)
- [Deployment Issues](#deployment-issues)
- [Feature-Specific Issues](#feature-specific-issues)

---

## Installation Issues

### npm install fails

**Symptoms:**
- Error messages during `npm install`
- Missing dependencies

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be 18+ 
   npm --version
   ```

3. **Use specific npm version:**
   ```bash
   npm install -g npm@latest
   ```

### Permission errors on Linux/Mac

**Symptoms:**
- `EACCES` errors during npm install

**Solution:**
```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

---

## Backend Issues

### Server won't start

**Symptoms:**
- Error: "Cannot find module"
- Error: "Port already in use"

**Solutions:**

1. **Missing dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Port 5000 in use:**
   ```bash
   # Find process using port 5000
   # Windows:
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac:
   lsof -i :5000
   kill -9 <PID>
   
   # Or change port in .env:
   PORT=5001
   ```

3. **Module not found:**
   ```bash
   # Delete and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### JWT errors

**Symptoms:**
- "Invalid token"
- "Token expired"
- "No token provided"

**Solutions:**

1. **Check JWT_SECRET is set:**
   ```bash
   # In backend/.env
   JWT_SECRET=your-secret-key-min-32-chars
   ```

2. **Token expired - login again:**
   - Tokens expire after 7 days by default
   - User needs to log in again

3. **Frontend not sending token:**
   - Check browser console for  errors
   - Verify token is in localStorage: `localStorage.getItem('dyslexia_token')`

### File upload issues

**Symptoms:**
- "File too large"
- "Unsupported file type"
- Upload hangs

**Solutions:**

1. **File size limit:**
   ```bash
   # In .env, increase limit (in bytes)
   MAX_FILE_SIZE=20971520  # 20MB
   ```

2. **Allowed file types:**
   - Only .txt and .pdf are supported
   - Check file extension is lowercase

3. **Upload directory missing:**
   ```bash
   cd backend
   mkdir -p uploads
   ```

4. **Check multer configuration:**
   - See `backend/utils/fileHandler.js`
   - Verify diskStorage is configured correctly

---

## Frontend Issues

### Blank page / White screen

**Symptoms:**
- Frontend loads but shows nothing
- Console shows JavaScript errors

**Solutions:**

1. **Check browser console (F12):**
   - Look for script loading errors
   - Check for CORS errors

2. **Verify file paths:**
   ```html
   <!-- All paths should be relative or absolute -->
   <script src="js/app.js"></script>
   ```

3. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Or use hard refresh: Ctrl+Shift+R

4. **Check Bootstrap CDN:**
   - Ensure internet connection
   - CDN links should be accessible

### API calls failing

**Symptoms:**
- Network errors in console
- "Failed to fetch"
- CORS errors

**Solutions:**

1. **Backend not running:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Wrong API URL:**
   ```javascript
   // In frontend/js/config.js
   BASE_URL: 'http://localhost:5000'  // Check this matches backend
   ```

3. **CORS errors:**
   ```bash
   # In backend/.env
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

4. **Mixed content (HTTP/HTTPS):**
   - If frontend is HTTPS, backend must be HTTPS too
   - Or use relative URLs

### PDF upload not extracting text

**Symptoms:**
- PDF uploads but shows no text
- Console error about PDF.js

**Solutions:**

1. **PDF.js not loaded:**
   ```html
   <!-- Verify this CDN link in index.html -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
   ```

2. **Worker not configured:**
   ```javascript
   // In pdfExtractor.js, verify:
   pdfjsLib.GlobalWorkerOptions.workerSrc = 
     'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
   ```

3. **PDF is image-based (scanned):**
   - PDF.js only extracts embedded text
   - Scanned PDFs need OCR (not supported)

4. **Corrupted PDF:**
   - Try a different PDF file
   - Check file is valid PDF format

---

## Database Issues

### MongoDB connection failed

**Symptoms:**
- "MongoNetworkError"
- "Authentication failed"
- "ECONNREFUSED"

**Solutions:**

1. **MongoDB not running:**
   ```bash
   # Start MongoDB
   # Windows (if installed via MSI):
   net start MongoDB
   
   # Linux:
   sudo systemctl start mongod
   
   # Docker:
   docker start mongodb
   # Or:
   docker run -d -p 27017:27017 mongo:6.0
   ```

2. **Wrong connection string:**
   ```bash
   # Local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/dyslexia-helper
   
   # MongoDB Atlas:
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dyslexia-helper
   ```

3. **Atlas network access:**
   - MongoDB Atlas > Network Access
   - Add IP 0.0.0.0/0 (development only!)
   - For production, add specific IPs

4. **Authentication failed:**
   - Check username/password in connection string
   - MongoDB Atlas: Verify database user exists
   - Check user has read/write privileges

### Database not seeding

**Symptoms:**
- `npm run seed` fails
- No demo users created

**Solutions:**

1. **Check MongoDB connection first:**
   ```bash
   # Test connection
   node -e "require('./backend/config/database').connectDatabase()"
   ```

2. **Clear existing data:**
   ```bash
   # In MongoDB:
   use dyslexia-helper
   db.users.drop()
   db.preferences.drop()
   db.documents.drop()
   db.histories.drop()
   ```

3. **Run seed again:**
   ```bash
   cd backend
   npm run seed
   ```

---

## Deployment Issues

### Render deployment fails

**Symptoms:**
- Build fails on Render
- Health check fails
- App crashes after deploy

**Solutions:**

1. **Build fails:**
   - Check build logs in Render dashboard
   - Ensure `package.json` has correct `start` script
   - Verify `NODE_ENV=production`

2. **Environment variables not set:**
   - Render dashboard > Environment
   - Add all required variables from `.env.example`
   - Click "Save Changes"

3. **Health check failing:**
   ```javascript
   // Verify /health endpoint exists in server.js
   app.get('/health', (req, res) => {
     res.status(200).json({ success: true });
   });
   ```

4. **MongoDB connection timeout:**
   - Check MongoDB Atlas network access
   - Whitelist Render's IPs
   - Verify connection string is correct

### Netlify deployment issues

**Symptoms:**
- Files not found (404)
- Build fails

**Solutions:**

1. **Wrong publish directory:**
   - Netlify settings > Build & deploy
   - Set "Publish directory" to `frontend`
   - Set "Base directory" to `frontend`

2. **Custom domain not working:**
   - Netlify > Domain settings
   - Configure DNS with your provider
   - Wait for DNS propagation (up to 48 hours)

3. **API calls fail after deploy:**
   ```javascript
   // Update frontend/js/config.js
   BASE_URL: 'https://your-backend.onrender.com'
   ```

### CORS errors in production

**Symptoms:**
- Frontend can't reach backend
- "No ' Access-Control-Allow-Origin' header"

**Solutions:**

1. **Add frontend URL to CORS:**
   ```bash
   # In Render environment variables:
   ALLOWED_ORIGINS=https://your-app.netlify.app
   ```

2. **Multiple origins:**
   ```bash
   ALLOWED_ORIGINS=https://app1.netlify.app,https://app2.netlify.app
   ```

3. **Credentials not included:**
   ```javascript
   // In backend/server.js
   app.use(cors({
     origin: config.allowedOrigins,
     credentials: true
   }));
   ```

---

## Feature-Specific Issues

### Text-to-Speech not working

**Symptoms:**
- TTS button disabled
- No audio plays
- Console errors

**Solutions:**

1. **Browser compatibility:**
   - Check browser supports Web Speech API
   - Visit: https://caniuse.com/speech-synthesis
   - Try Chrome/Edge (best support)

2. **HTTPS required:**
   - Local development: Use http://localhost (allowed)
   - Production: Must use HTTPS
   - Netlify/Render provide HTTPS automatically

3. **User interaction required:**
   - TTS can only start after user clicks something
   - Browser security policy
   - User must click "Play" button first

4. **Text not loaded:**
   - Ensure text is in the reading area
   - Check `UI.currentText` is not empty

### Syllable splitting not working

**Symptoms:**
- Toggle does nothing
- Words not split
- Strange hyphenation

**Solutions:**

1. **Check syllable.js loaded:**
   ```javascript
   // In browser console:
   console.log(typeof Syllable);  // Should be "object"
   ```

2. **Algorithm limitations:**
   - Works best with common English words
   - May not handle technical terms perfectly
   - Proper nouns may split oddly

3. **Improve accuracy:**
   - See `syllable.js` exceptions dictionary
   - Add custom words to exceptions object

### Preferences not saving

**Symptoms:**
- Settings reset on reload
- "Save Preferences" fails

**Solutions:**

1. **Not logged in:**
   - Preferences only save to server when logged in
   - Without login, they save to localStorage only
   - Login to sync across devices

2. **LocalStorage full:**
   ```javascript
   // Clear localStorage if needed:
   localStorage.clear();
   ```

3. **API error:**
   - Check network tab in browser console
   - Look for 401 (auth) or 500 (server) errors
   - Ensure token is valid

---

## Performance Issues

### Slow PDF loading

**Solutions:**

1. **Large PDF files:**
   - Increase upload timeout
   - Process PDFs server-side instead (already implemented)

2. **Many pages:**
   - PDF.js loads all pages
   - Consider limiting page extraction

### App feels slow

**Solutions:**

1. **Too many documents:**
   - Pagination not implemented
   - Consider adding lazy loading

2. **Large text content:**
   - TTS word-by-word can be slow for long texts
   - Consider chunking large documents

3. **Browser extensions:**
   - Disable ad blockers temporarily
   - Some extensions interfere with localStorage

---

## Development Issues

### Tests failing

**Symptoms:**
- `npm test` shows errors

**Solutions:**

1. **Test database:**
   ```bash
   # Use separate test database
   MONGODB_URI_TEST=mongodb://localhost:27017/dyslexia-helper-test
   ```

2. **Test timeout:**
   ```javascript
   // In test file:
   jest.setTimeout(10000);  // 10 seconds
   ```

3. **MongoDB not running:**
   - Ensure MongoDB is running for tests
   - Tests use in-memory MongoDB service

### Docker issues

**Symptoms:**
- docker-compose fails
- Containers won't start

**Solutions:**

1. **Port conflicts:**
   ```yaml
   # In docker-compose.yml, change ports:
   ports:
     - "5001:5000"  # frontend port : container port
   ```

2. **MongoDB container issues:**
   ```bash
   # Remove and recreate:
   docker-compose down -v
   docker-compose up -d
   ```

3. **Permission issues:**
   ```bash
   # Windows: Run Docker Desktop as administrator
   # Linux: Add user to docker group
   sudo usermod -aG docker $USER
   ```

---

## Getting Help

If your issue isn't listed here:

1. **Check logs:**
   - Backend: Console output
   - Frontend: Browser console (F12)
   - MongoDB: MongoDB logs

2. **Search existing issues:**
   - GitHub Issues tab
   - Stack Overflow

3. **Create a new issue:**
   - Include error messages
   - Describe steps to reproduce
   - Include environment (OS, Node version, etc.)

4. **Community support:**
   - GitHub Discussions
   - Stack Overflow (tag: `dyslexia-helper`)

---

## Debug Mode

Enable detailed logging:

```bash
# Backend .env
NODE_ENV=development
```

This will:
- Show detailed error messages
- Log all API requests
- Display MongoDB queries

**Important:** Never use `NODE_ENV=development` in production!

---

## Still Having Issues?

Create a detailed bug report with:
- Environment (OS, Node version, browser)
- Steps to reproduce
- Expected vs actual behavior
- Error messages / screenshots
- Relevant log output

Open an issue on GitHub: [Repository Issues](https://github.com/YOUR_USERNAME/dyslexia-helper/issues)
