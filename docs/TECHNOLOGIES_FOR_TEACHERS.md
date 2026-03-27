# Technologies Used in "Helper for Dyslexia" Application

This document explains all the technologies used in this project in simple, non-technical terms for teachers and educators.

---

## 📱 **Frontend Technologies** (What Users See and Interact With)

### Core Web Technologies

#### **1. HTML5** (HyperText Markup Language)
- **What it is**: The building blocks that create the structure of web pages
- **How it's used**: Creates all the buttons, text areas, and reading interface that students interact with
- **Example**: The text reading area, login forms, and document upload buttons are all built with HTML

#### **2. CSS3** (Cascading Style Sheets)
- **What it is**: The "paint and decoration" that makes the website look beautiful
- **How it's used**: Controls colors, fonts, spacing, and layout to make the interface comfortable for dyslexic readers
- **Example**: The blue/yellow/green overlays, adjustable text sizes, and custom spacing are all styled with CSS

#### **3. JavaScript (ES6+)**
- **What it is**: The "brain" of the application that makes everything interactive
- **How it's used**: Handles all the interactive features like syllable splitting, text-to-speech, and saving preferences
- **Example**: When you click "Split Syllables," JavaScript splits the words in real-time

---

### UI Framework & Libraries

#### **4. Bootstrap 5**
- **What it is**: A pre-built set of design components that makes websites look professional and work on all devices
- **How it's used**: Provides buttons, forms, navigation menus, and responsive layouts
- **Example**: The top navigation bar and login/signup forms use Bootstrap components
- **Why it matters**: Ensures the app works perfectly on computers, tablets, and phones

#### **5. PDF.js**
- **What it is**: A tool made by Mozilla (creators of Firefox) to read PDF files in web browsers
- **How it's used**: Extracts text from PDF documents so students can read them with dyslexia-friendly features
- **Example**: When a student uploads a PDF textbook, PDF.js converts it to readable text

#### **6. Web Speech API**
- **What it is**: A built-in browser feature that converts text to spoken words
- **How it's used**: Powers the text-to-speech feature that reads content aloud
- **Example**: When students click the "play" button, the browser speaks the text
- **Note**: Works best in Chrome, Edge, and Safari

---

### Custom JavaScript Modules

#### **7. Syllable Splitting Algorithm**
- **What it is**: Custom code that breaks words into syllables
- **How it's used**: Helps dyslexic readers by dividing words like "un-der-stand-ing"
- **Benefits**: Makes longer words easier to decode and read

#### **8. PDF Text Extractor**
- **What it is**: Custom code that pulls readable text from PDF files
- **How it's used**: Works with PDF.js to extract text from uploaded documents
- **Example**: Converts a PDF assignment into text that can be customized

#### **9. Local Storage Manager**
- **What it is**: A system that saves settings directly in the user's browser
- **How it's used**: Remembers font preferences, text size, and overlay colors
- **Benefits**: Students don't lose their settings when they close the browser

---

## 🔧 **Backend Technologies** (Behind-the-Scenes Server)

### Server & Framework

#### **10. Node.js (v18+)**
- **What it is**: A platform that runs JavaScript on a server (not just in browsers)
- **How it's used**: Powers the entire backend server that handles user accounts and document storage
- **Why it matters**: Fast, efficient, and uses the same language (JavaScript) as the frontend

#### **11. Express.js**
- **What it is**: A framework that makes building web servers easier
- **How it's used**: Handles requests like "save document," "login user," or "get preferences"
- **Example**: When a student saves a document, Express processes and stores it

---

### Database

#### **12. MongoDB (v6.0)**
- **What it is**: A modern database that stores information in a flexible format (like digital filing cabinets)
- **How it's used**: Stores user accounts, saved documents, reading preferences, and usage statistics
- **Example**: Saves student preferences like "18px font" and "blue overlay"
- **Why MongoDB**: Easy to work with, scales well, and stores complex data efficiently

#### **13. Mongoose**
- **What it is**: A tool that makes working with MongoDB easier and safer
- **How it's used**: Defines data structures and validates information before saving
- **Example**: Ensures email addresses are valid before creating accounts

---

### Security & Authentication

#### **14. bcrypt**
- **What it is**: A security tool that encrypts passwords
- **How it's used**: Converts passwords into unreadable code before storing them
- **Why it matters**: Even database administrators can't see actual passwords
- **Example**: Password "Student123!" becomes an encrypted hash

#### **15. JSON Web Tokens (JWT)**
- **What it is**: A secure way to verify user identity without constantly asking for passwords
- **How it's used**: Creates a secure "token" when users log in that proves who they are
- **Example**: After logging in, students can navigate the app without re-entering passwords

#### **16. Helmet.js**
- **What it is**: Security middleware that protects against common web attacks
- **How it's used**: Adds protective HTTP headers to all responses
- **Why it matters**: Prevents hacking attempts like cross-site scripting (XSS)

#### **17. CORS (Cross-Origin Resource Sharing)**
- **What it is**: Security feature that controls which websites can access the server
- **How it's used**: Ensures only the official frontend can communicate with the backend
- **Why it matters**: Prevents unauthorized websites from accessing student data

---

### Data Validation & Protection

#### **18. express-validator**
- **What it is**: A tool that checks if incoming data is safe and correct
- **How it's used**: Validates emails, passwords, and file uploads before processing
- **Example**: Ensures uploaded files are actually TXT or PDF (not viruses)

#### **19. express-rate-limit**
- **What it is**: A tool that prevents people from making too many requests too quickly
- **How it's used**: Limits login attempts to prevent password guessing attacks
- **Example**: Blocks someone trying 1000 passwords in one minute

---

### File Handling

#### **20. Multer**
- **What it is**: A tool for handling file uploads
- **How it's used**: Processes PDF and TXT files when students upload documents
- **Features**: Sets file size limits (10MB) and filters file types
- **Example**: Accepts a student's PDF textbook and stores it safely

#### **21. pdf-parse**
- **What it is**: Server-side tool to extract text from PDF files
- **How it's used**: Backup method for extracting PDF text on the server
- **Example**: Reads a PDF syllabus and converts it to plain text

---

### Logging & Monitoring

#### **22. Morgan**
- **What it is**: A logging tool that records all server activity
- **How it's used**: Tracks requests, errors, and performance
- **Benefits**: Helps diagnose problems when something goes wrong
- **Example**: Logs every document upload with timestamp and user info

---

## 🧪 **Testing & Development**

#### **23. Jest**
- **What it is**: A testing framework for JavaScript
- **How it's used**: Automatically tests backend features to catch bugs
- **Example**: Tests that login works correctly and passwords are validated

#### **24. Supertest**
- **What it is**: A tool for testing HTTP requests
- **How it's used**: Tests API endpoints like document upload and user registration
- **Example**: Simulates a student logging in and verifies it works

#### **25. Nodemon**
- **What it is**: A development tool that automatically restarts the server when code changes
- **How it's used**: Speeds up development by eliminating manual server restarts
- **Benefits**: Developers see changes immediately while building features

---

## 🐳 **DevOps & Deployment**

#### **26. Docker**
- **What it is**: A tool that packages the entire application into a "container"
- **How it's used**: Ensures the app runs identically on any computer or server
- **Benefits**: Makes deployment consistent and reliable
- **Example**: The app runs the same on a Windows PC, Mac, or cloud server

#### **27. Docker Compose**
- **What it is**: A tool that manages multiple Docker containers together
- **How it's used**: Starts the backend, frontend, and database all at once
- **Benefits**: Simplifies running the complete application locally

#### **28. GitHub Actions**
- **What it is**: Automation tool built into GitHub
- **How it's used**: Automatically runs tests when new code is added
- **Benefits**: Catches bugs before they reach students
- **Example**: Tests all features automatically when developers update the code

---

## 🎨 **Fonts & Accessibility**

#### **29. OpenDyslexic Font**
- **What it is**: A font designed specifically for dyslexic readers
- **Created by**: Abelardo Gonzalez
- **How it's used**: One of the primary font options in the reading interface
- **Features**: Weighted bottoms on letters to prevent rotation and confusion

#### **30. Lexend Font**
- **What it is**: A font designed to improve reading proficiency
- **Created by**: Thomas Jockin
- **How it's used**: Alternative font option optimized for readability
- **Benefits**: Scientifically designed to reduce visual stress

---

## 🌐 **Web APIs & Browser Features**

#### **31. LocalStorage API**
- **What it is**: Built-in browser storage that saves data on the user's device
- **How it's used**: Stores preferences and settings locally
- **Benefits**: App works offline and remembers settings
- **Example**: Saves a student's preferred font even without internet

#### **32. Fetch API**
- **What it is**: Modern browser feature for making HTTP requests
- **How it's used**: Communicates between the frontend and backend
- **Example**: Sends document uploads from the browser to the server

---

## 🔐 **Environment & Configuration**

#### **33. dotenv**
- **What it is**: A tool for managing sensitive configuration settings
- **How it's used**: Stores database passwords, API keys, and other secrets
- **Benefits**: Keeps sensitive information out of the code
- **Example**: Stores the MongoDB connection string securely

---

## 📊 **Summary by Category**

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5, PDF.js, Web Speech API |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Security** | bcrypt, JWT, Helmet.js, CORS, express-validator, express-rate-limit |
| **File Handling** | Multer, pdf-parse |
| **Testing** | Jest, Supertest, Nodemon |
| **Deployment** | Docker, Docker Compose, GitHub Actions |
| **Fonts** | OpenDyslexic, Lexend |
| **Development Tools** | Morgan (logging), dotenv (configuration) |

---

## 💡 **Why These Technologies?**

### Student-Focused Features
- **PDF.js & pdf-parse**: Allow students to work with any PDF document
- **Web Speech API**: Provides free text-to-speech without external services
- **LocalStorage**: Works offline so students can read without internet

### Teacher & Admin Benefits
- **MongoDB**: Easily track student usage and reading progress
- **Analytics Dashboard**: See which features are most helpful
- **Document Management**: Students can save and organize reading materials

### Security & Privacy
- **bcrypt + JWT**: Protects student accounts and data
- **CORS + Helmet**: Prevents unauthorized access
- **Rate Limiting**: Protects against malicious attacks

### Ease of Use
- **Bootstrap 5**: Works beautifully on all devices (phones, tablets, computers)
- **Responsive Design**: Adapts to any screen size automatically
- **Intuitive Interface**: Built with accessibility in mind

---

## 🎯 **Educational Value**

This application demonstrates how modern web technologies can:
1. **Support diverse learners** through customizable interfaces
2. **Promote independence** with text-to-speech and syllable splitting
3. **Track progress** with analytics and saved preferences
4. **Scale effectively** to serve many students simultaneously
5. **Maintain security** while being user-friendly

---

## 📚 **For Teachers: Key Takeaways**

- The app uses **industry-standard, open-source technologies** (all are free and well-supported)
- **Security is built-in** from the ground up (passwords encrypted, data protected)
- **Accessibility features** are powered by modern browser capabilities
- **No external dependencies** for core reading features (works offline)
- **Fully customizable** to meet individual student needs
- **Analytics included** to track feature usage and effectiveness

---

## 🔗 **Learn More**

If you'd like to explore any technology in more depth:
- **Frontend**: [MDN Web Docs](https://developer.mozilla.org/)
- **Node.js**: [nodejs.org](https://nodejs.org/)
- **MongoDB**: [mongodb.com/docs](https://docs.mongodb.com/)
- **Accessibility**: [W3C Accessibility Guidelines](https://www.w3.org/WAI/)

---

**Questions?** Contact your technical team or open an issue on GitHub.
