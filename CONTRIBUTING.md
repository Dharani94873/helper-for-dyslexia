# Contributing to Accessibility Helper for Dyslexia

Thank you for considering contributing to this project! We welcome contributions that help make reading more accessible for dyslexic users.

## 🤝 How to Contribute

### Reporting Bugs

**Before submitting a bug report:**
- Check existing issues to avoid duplicates
- Test with the latest version
- Gather environment details (OS, browser, Node version)

**Bug Report Template:**
```markdown
**Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: Windows 10
- Browser: Chrome 120
- Node: 18.17.0

**Screenshots:**
If applicable

**Additional Context:**
Any other relevant information
```

### Suggesting Features

**Feature Request Template:**
```markdown
**Feature Description:**
What feature would you like to see?

**Use Case:**
How would this benefit dyslexic readers?

**Proposed Implementation:**
Any ideas on how to implement this?

**Alternatives:**
What alternatives have you considered?
```

### Pull Requests

**Before submitting a PR:**

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages:**
   ```bash
   git commit -m "Add syllable splitting for French language"
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

**PR Checklist:**
- [ ] Code follows existing style conventions
- [ ] Comments added for complex logic
- [ ] Tests added/updated as needed
- [ ] Documentation updated
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Tested in multiple browsers (Chrome, Firefox, Safari)

## 📝 Code Style Guidelines

### JavaScript

- Use ES6+ syntax
- Use `const` and `let`, avoid `var`
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Handle errors gracefully

**Example:**
```javascript
/**
 * Split text into syllables
 * @param {string} text - The text to split
 * @returns {string} - Text with syllable markers
 */
function splitText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Implementation...
}
```

### Backend (Node.js)

- Use async/await instead of callbacks
- Validate all inputs
- Use proper HTTP status codes
- Log errors appropriately
- Follow RESTful conventions

**Example:**
```javascript
// Good
router.post('/documents', auth, async (req, res, next) => {
  try {
    const { title, text } = req.body;
    
    // Validation
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }
    
    // Process...
  } catch (error) {
    next(error);
  }
});
```

### CSS

- Use meaningful class names
- Avoid inline styles
- Use CSS variables for colors
- Make responsive by default
- Consider accessibility (contrast, focus states)

### HTML

- Use semantic HTML5 elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

## 🧪 Testing

### Running Tests

```bash
cd backend
npm test
```

### Writing Tests

**Backend Tests (Jest):**
```javascript
describe('Authentication', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

**Frontend Testing:**
- Manual testing in multiple browsers
- Test with keyboard navigation
- Test with screen reader
- Test mobile responsiveness

## 🎯 Areas That Need Help

**High Priority:**
- [ ] Additional language support (Spanish, French, German)
- [ ] OCR for scanned PDFs
- [ ] Mobile app version
- [ ] Voice commands
- [ ] More TTS voices and customization

**Medium Priority:**
- [ ] Reading comprehension tracking
- [ ] Reading speed analytics
- [ ] Customizable themes
- [ ] Browser extension
- [ ] Offline mode improvements

**Low Priority (nice to have):**
- [ ] Social features (share settings)
- [ ] Reading goals and achievements
- [ ] Export to different formats
- [ ] Integration with e-readers

## 🌐 Internationalization

To add a new language:

1. **Update syllable.js** with language-specific rules
2. **Add translations** for UI strings
3. **Update documentation**
4. **Test thoroughly** with native speakers

## 🔒 Security

**If you discover a security vulnerability:**

1. **DO NOT** open a public issue
2. Email: [security email - to be added]
3. Provide detailed description
4. Include steps to reproduce
5. Suggest a fix if possible

We will respond within 48 hours.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

- Check the [README](../README.md)
- Read the [Documentation](DEPLOYMENT.md)
- Open a GitHub Discussion
- Ask in Issues (tag with "question")

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference in helping dyslexic users read more comfortably.

**Top Contributors:**
- [Your name could be here!]

---

**Happy Contributing! 🎉**
