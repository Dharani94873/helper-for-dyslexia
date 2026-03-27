/**
 * PDF Extraction Module
 * Uses PDF.js to extract text from PDF files on the client side
 */

const PDFExtractor = {
    /**
     * Initialize PDF.js worker
     */
    init() {
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
    },

    /**
     * Extract text from PDF file
     */
    async extractText(file) {
        try {
            if (typeof pdfjsLib === 'undefined') {
                throw new Error('PDF.js library not loaded');
            }

            // Read file as ArrayBuffer
            const arrayBuffer = await this.fileToArrayBuffer(file);

            // Load PDF document
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = '';

            // Extract text from each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();

                // Combine text items
                const pageText = textContent.items
                    .map(item => item.str)
                    .join(' ');

                fullText += pageText + '\n\n';
            }

            return {
                success: true,
                text: fullText.trim(),
                pages: pdf.numPages
            };
        } catch (error) {
            console.error('PDF extraction error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Convert File to ArrayBuffer
     */
    fileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                resolve(e.target.result);
            };

            reader.onerror = (e) => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsArrayBuffer(file);
        });
    },

    /**
     * Get PDF metadata
     */
    async getMetadata(file) {
        try {
            const arrayBuffer = await this.fileToArrayBuffer(file);
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const metadata = await pdf.getMetadata();

            return {
                pages: pdf.numPages,
                info: metadata.info,
                metadata: metadata.metadata
            };
        } catch (error) {
            console.error('Failed to get PDF metadata:', error);
            return null;
        }
    }
};

// Initialize on load
if (typeof pdfjsLib !== 'undefined') {
    PDFExtractor.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFExtractor;
}
