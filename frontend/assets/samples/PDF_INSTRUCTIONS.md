# Sample PDF Note

Since binary PDF files cannot be created programmatically in this repository, you have two options:

## Option 1: Create Sample PDF

To test PDF upload functionality:

1. **Create a simple PDF:**
   - Open any text editor
   - Paste the content from `sample.txt`
   - Print to PDF (or use "Save as PDF" in Word/Google Docs)
   - Save as `sample.pdf` in this directory

2. **Or download a sample PDF:**
   - Visit: https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
   - Save to this directory

## Option 2: Use Online PDFs for Testing

When testing the application, you can use any PDF file from your computer or download free PDFs from:
- Project Gutenberg: https://www.gutenberg.org/ (public domain books)
- Sample PDFs: https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf

## Testing PDF Extraction

The application supports two methods of PDF text extraction:

1. **Client-side (PDF.js)**: Works in the browser without backend
2. **Server-side (pdf-parse)**: Processes PDFs when uploaded to backend

Both methods are implemented in the application.

## Creating Your Own Test PDF

**Easy Method:**
```bash
# On Windows with PowerShell:
"This is a test PDF for the Dyslexia Helper application." | Out-File -FilePath test.txt
# Then right-click test.txt -> Print -> Save as PDF

# On Mac:
echo "This is a test PDF for the Dyslexia Helper application." > test.txt
# Then open test.txt -> File -> Export as PDF

# On Linux:
echo "This is a test PDF for the Dyslexia Helper application." > test.txt
# Install: sudo apt-get install wkhtmltopdf
wkhtmltopdf test.txt sample.pdf
```

The application will extract text from any text-based PDF (not scanned images).
