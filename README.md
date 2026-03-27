# Accessibility Helper for Dyslexia 📚

A comprehensive, production-ready web application designed to help dyslexic users read more comfortably with customizable text formatting, syllable splitting, color overlays, and text-to-speech capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)

---

## ✨ Features

### Reading Tools
- **Custom Fonts**: OpenDyslexic and Lexend fonts designed for dyslexic readers
- **Adjustable Spacing**: Control letter, line, and word spacing
- **Text Size Control**: Easily adjust font size (12-32px)
- **Color Overlays**: Blue, yellow, green, or pink tints with adjustable opacity
- **Syllable Splitting**: Break words into syllables with visual hyphens
- **Text-to-Speech**: Listen to text with real-time word highlighting
- **Distraction-Free Mode**: Minimize visual clutter for focused reading

### Document Management
- **File Upload**: Support for TXT and PDF files
- **Paste Text**: Quick text input for immediate reading
- **Save Documents**: Store documents in your account
- **Reading Progress**: Track your progress through documents
- **Document Library**: Manage all your saved documents

### User Features
- **User Accounts**: Secure authentication with JWT
- **Saved Preferences**: Preferences sync across devices
- **Offline Support**: Core features work without backend
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Quick controls for power users

### Admin Features
- **Analytics Dashboard**: Track usage statistics
- **User Management**: View user data and activity
- **Feature Analytics**: See which features are most used

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 6.0+ (local or MongoDB Atlas)
- **Git**

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dyslexia-helper.git
   cd dyslexia-helper
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Minimum required in `.env`:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/dyslexia-helper
   JWT_SECRET=your-super-secret-key-change-this
   ```

4. **Start MongoDB**
   ```bash
   # If using Docker:
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   
   # Or use local MongoDB installation
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

   This creates demo accounts:
   - **Admin**: `admin@example.com` / `Admin123!`
   - **User**: `user@example.com` / `User123!`

6. **Start the backend server**
   ```bash
   npm run dev
   ```

   Backend runs at: `http://localhost:5000`

7. **Serve the frontend** (in a new terminal)
   ```bash
   cd frontend
   
   # Using Python:
   python -m http.server 3000
   
   # Or using PHP:
   php -S localhost:3000
   
   # Or using Node's http-server:
   npx http-server -p 3000
   ```

   Frontend runs at: `http://localhost:3000`

8. **Open in browser**
   
   Visit: `http://localhost:3000`

---

## 🏗️ Project Structure

```
dyslexia-helper/
├── backend/                  # Backend API (Node.js + Express)
│   ├── config/              # Configuration files
│   │   ├── config.js        # Environment configuration
│   │   └── database.js      # MongoDB connection
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── preferencesController.js
│   │   ├── documentsController.js
│   │   └── analyticsController.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── admin.js         # Admin authorization
│   │   ├── validation.js    # Input validation
│   │   └── errorHandler.js  # Error handling
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Preference.js
│   │   ├── Document.js
│   │   └── History.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── preferences.js
│   │   ├── documents.js
│   │   └── analytics.js
│   ├── scripts/             # Utility scripts
│   │   └── seed.js          # Database seeding
│   ├── tests/               # Test files
│   │   ├── auth.test.js
│   │   └── documents.test.js
│   ├── utils/               # Helper utilities
│   │   ├── fileHandler.js   # File upload handling
│   │   └── logger.js        # Logging utility
│   ├── .env.example         # Environment template
│   ├── Dockerfile           # Docker configuration
│   ├── package.json
│   └── server.js            # Express server entry
│
├── frontend/                # Frontend (HTML/CSS/JS)
│   ├── assets/
│   │   ├── fonts/           # Custom fonts
│   │   └── samples/         # Sample files
│   │       └── sample.txt
│   ├── css/
│   │   └── styles.css       # Custom styles
│   ├── js/                  # JavaScript modules
│   │   ├── config.js        # API configuration
│   │   ├── storage.js       # LocalStorage helper
│   │   ├── api.js           # API client
│   │   ├── syllable.js      # Syllable splitting
│   │   ├── pdfExtractor.js  # PDF text extraction
│   │   ├── tts.js           # Text-to-speech
│   │   ├── ui.js            # UI controls
│   │   └── app.js           # Main application
│   ├── index.html           # Main reader page
│   ├── login.html           # Login page
│   ├── signup.html          # Signup page
│   ├── dashboard.html       # Document management
│   ├── admin.html           # Analytics dashboard
│   └── package.json
│
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── TROUBLESHOOTING.md   # Troubleshooting guide
│
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD
│
├── docker-compose.yml       # Docker Compose config
├── .gitignore
├── .env.example
└── README.md               # This file
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Tests include:
- Authentication (signup, login)
- Document upload and retrieval
- Preferences management
- File validation

### Manual Testing

1. **Upload a PDF** and verify text extraction
2. **Apply syllable splitting** and check hyphenation
3. **Use text-to-speech** and verify word highlighting
4. **Save preferences** and reload to check persistence
5. **Test offline mode** by stopping the backend

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Local Development)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Seed database
docker-compose exec backend npm run seed

# Stop services
docker-compose down
```

### Building Backend Docker Image

```bash
cd backend
docker build -t dyslexia-helper-backend .
docker run -p 5000:5000 --env-file .env dyslexia-helper-backend
```

---

## 🌐 Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for complete deployment instructions including:

- MongoDB Atlas setup
- Render backend deployment
- Netlify frontend deployment
- GitHub Actions CI/CD
- Alternative platforms (Heroku, Railway, GitHub Pages)

### Quick Deploy Checklist

- [ ] Create MongoDB Atlas cluster
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Netlify
- [ ] Update CORS settings
- [ ] Seed production database
- [ ] Test all features in production

---

## 📖 API Documentation

### Authentication

**POST** `/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Documents

**POST** `/documents/upload` (multipart/form-data)
- Upload TXT or PDF file

**GET** `/documents`
- Get all user documents

**GET** `/documents/:id`
- Get specific document

**DELETE** `/documents/:id`
- Delete document

### Preferences

**GET** `/preferences`
- Get user preferences

**POST** `/preferences`
```json
{
  "font": "opendyslexic",
  "textSize": 18,
  "syllableSplit": true,
  "colorOverlay": "blue"
}
```

Full API documentation: See [backend/routes/](backend/routes/)

---

## ⌨️ Keyboard Shortcuts

- **Space**: Play/Pause text-to-speech
- **Escape**: Stop TTS or exit distraction-free mode
- **Ctrl/Cmd + S**: Save preferences

---

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript (ES6+)
- Bootstrap 5 (UI framework)
- PDF.js (PDF text extraction)
- Web Speech API (text-to-speech)

### Backend
- Node.js 18+
- Express.js (web framework)
- MongoDB with Mongoose (database)
- JWT (authentication)
- bcrypt (password hashing)
- Multer (file uploads)
- pdf-parse (server-side PDF parsing)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Jest (testing)

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation and sanitization
- ✅ File upload size limits
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection (Helmet.js)

---

## 🌍 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Text-to-speech requires modern browsers with Web Speech API

Check compatibility: [Can I Use - Web Speech API](https://caniuse.com/speech-synthesis)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **OpenDyslexic Font**: by Abelardo Gonzalez
- **Lexend Font**: by Thomas Jockin
- **PDF.js**: by Mozilla
- **Bootstrap**: by the Bootstrap team

---

## 📞 Support & Troubleshooting

See **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** for common issues and solutions.

### Common Issues

**Problem**: CORS errors  
**Solution**: Ensure `ALLOWED_ORIGINS` in backend includes your frontend URL

**Problem**: MongoDB connection failed  
**Solution**: Check network access in MongoDB Atlas and verify connection string

**Problem**: TTS not working  
**Solution**: HTTPS required in production; ensure browser supports Web Speech API

**Problem**: File upload fails  
**Solution**: Check `MAX_FILE_SIZE` limit and ensure uploads directory exists

---

## 📊 Demo

**Live Demo**: [Coming Soon]

**Demo Credentials**:
- Email: `user@example.com`
- Password: `User123!`

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Additional language support
- [ ] Voice commands
- [ ] Integration with screen readers
- [ ] Advanced analytics
- [ ] Collaborative reading features
- [ ] Browser extension

---

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for accessibility**
