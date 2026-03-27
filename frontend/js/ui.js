/**
 * UI Control Module
 * Manages all UI interactions and DOM updates
 */

const UI = {
    elements: {},
    currentText: '',
    currentPreferences: {},

    /**
     * Initialize UI elements
     */
    init() {
        // Cache DOM elements
        this.elements = {
            // Text content
            textContent: document.getElementById('textContent'),
            emptyState: document.getElementById('emptyState'),

            // Controls
            fontSelect: document.getElementById('fontSelect'),
            textSize: document.getElementById('textSize'),
            textSizeValue: document.getElementById('textSizeValue'),
            letterSpacing: document.getElementById('letterSpacing'),
            letterSpacingValue: document.getElementById('letterSpacingValue'),
            lineHeight: document.getElementById('lineHeight'),
            lineHeightValue: document.getElementById('lineHeightValue'),
            wordSpacing: document.getElementById('wordSpacing'),
            wordSpacingValue: document.getElementById('wordSpacingValue'),
            colorOverlay: document.getElementById('colorOverlay'),
            overlayOpacity: document.getElementById('overlayOpacity'),
            overlayOpacityValue: document.getElementById('overlayOpacityValue'),
            syllableSplit: document.getElementById('syllableSplit'),
            distractionFree: document.getElementById('distractionFree'),

            // Buttons
            pasteBtn: document.getElementById('pasteBtn'),
            txtUpload: document.getElementById('txtUpload'),
            pdfUpload: document.getElementById('pdfUpload'),
            savePrefsBtn: document.getElementById('savePrefsBtn'),
            downloadBtn: document.getElementById('downloadBtn'),

            // TTS
            ttsPlay: document.getElementById('ttsPlay'),
            ttsPause: document.getElementById('ttsPause'),
            ttsStop: document.getElementById('ttsStop'),
            ttsStatus: document.getElementById('ttsStatus'),

            // Modal
            pasteModal: document.getElementById('pasteModal'),
            pastedText: document.getElementById('pastedText'),
            pastedTitle: document.getElementById('pastedTitle'),
            confirmPaste: document.getElementById('confirmPaste'),

            // Toast
            toast: document.getElementById('toast'),
            toastTitle: document.getElementById('toastTitle'),
            toastMessage: document.getElementById('toastMessage')
        };

        this.setupEventListeners();
        this.loadPreferences();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Font control
        this.elements.fontSelect.addEventListener('change', () => this.applyFormatting());

        // Size and spacing controls
        this.elements.textSize.addEventListener('input', (e) => {
            this.elements.textSizeValue.textContent = e.target.value;
            this.applyFormatting();
        });

        this.elements.letterSpacing.addEventListener('input', (e) => {
            this.elements.letterSpacingValue.textContent = e.target.value;
            this.applyFormatting();
        });

        this.elements.lineHeight.addEventListener('input', (e) => {
            this.elements.lineHeightValue.textContent = e.target.value;
            this.applyFormatting();
        });

        this.elements.wordSpacing.addEventListener('input', (e) => {
            this.elements.wordSpacingValue.textContent = e.target.value;
            this.applyFormatting();
        });

        // Color overlay
        this.elements.colorOverlay.addEventListener('change', () => this.applyFormatting());
        this.elements.overlayOpacity.addEventListener('input', (e) => {
            this.elements.overlayOpacityValue.textContent = e.target.value;
            this.applyFormatting();
        });

        // Features
        this.elements.syllableSplit.addEventListener('change', () => this.updateText());
        this.elements.distractionFree.addEventListener('change', () => this.toggleDistractionFree());

        // File uploads
        this.elements.txtUpload.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0], 'txt'));
        this.elements.pdfUpload.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0], 'pdf'));

        // Download button
        this.elements.downloadBtn.addEventListener('click', () => this.downloadText());

        // Save preferences
        this.elements.savePrefsBtn.addEventListener('click', () => this.savePreferences());
    },

    /**
     * Load text into reader
     */
    loadText(text, title = '') {
        this.currentText = text;
        this.updateText();

        this.elements.emptyState.style.display = 'none';
        this.elements.textContent.style.display = 'block';
        this.elements.downloadBtn.disabled = false;
        this.elements.ttsPlay.disabled = false;
    },

    /**
     * Update displayed text with current settings
     */
    updateText() {
        let displayText = this.currentText;

        // Apply syllable splitting if enabled
        if (this.elements.syllableSplit.checked && displayText) {
            displayText = Syllable.splitText(displayText);
        }

        this.elements.textContent.textContent = displayText;
        this.applyFormatting();
    },

    /**
     * Apply formatting to text
     */
    applyFormatting() {
        const el = this.elements.textContent;

        // Font
        el.className = 'text-content';
        const font = this.elements.fontSelect.value;
        if (font !== 'default') {
            el.classList.add(`font-${font}`);
        }

        // Size and spacing
        el.style.fontSize = `${this.elements.textSize.value}px`;
        el.style.letterSpacing = `${this.elements.letterSpacing.value}px`;
        el.style.lineHeight = this.elements.lineHeight.value;
        el.style.wordSpacing = `${this.elements.wordSpacing.value}px`;

        // Color overlay
        const overlay = this.elements.colorOverlay.value;
        if (overlay !== 'none') {
            el.classList.add(`overlay-${overlay}`);
            const opacity = this.elements.overlayOpacity.value / 100;
            el.style.setProperty('--overlay-opacity', opacity);
        }
    },

    /**
     * Toggle distraction-free mode
     */
    toggleDistractionFree() {
        document.body.classList.toggle('distraction-free', this.elements.distractionFree.checked);
    },

    /**
     * Handle file upload
     */
    async handleFileUpload(file, type) {
        if (!file) return;

        this.showToast('Info', 'Processing file...', 'info');

        try {
            let text = '';

            if (type === 'txt') {
                text = await this.readTextFile(file);
            } else if (type === 'pdf') {
                const result = await PDFExtractor.extractText(file);
                if (result.success) {
                    text = result.text;
                } else {
                    throw new Error(result.error || 'Failed to extract PDF text');
                }
            }

            this.loadText(text, file.name);
            this.showToast('Success', 'File loaded successfully', 'success');

            // Upload to server if logged in
            if (Storage.getToken()) {
                try {
                    await API.uploadDocument(file);
                    this.showToast('Success', 'File saved to your account', 'success');
                } catch (error) {
                    console.error('Failed to upload to server:', error);
                }
            }
        } catch (error) {
            this.showToast('Error', error.message, 'danger');
        }
    },

    /**
     * Read text file
     */
    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },

    /**
     * Download current text
     */
    downloadText() {
        const text = this.elements.syllableSplit.checked
            ? this.elements.textContent.textContent
            : this.currentText;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'processed-text.txt';
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Success', 'Text downloaded', 'success');
    },

    /**
     * Get current preferences
     */
    getCurrentPreferences() {
        return {
            font: this.elements.fontSelect.value,
            textSize: parseInt(this.elements.textSize.value),
            letterSpacing: parseInt(this.elements.letterSpacing.value),
            lineHeight: parseFloat(this.elements.lineHeight.value),
            wordSpacing: parseInt(this.elements.wordSpacing.value),
            colorOverlay: this.elements.colorOverlay.value,
            overlayOpacity: parseInt(this.elements.overlayOpacity.value),
            syllableSplit: this.elements.syllableSplit.checked,
            distractionFree: this.elements.distractionFree.checked
        };
    },

    /**
     * Save preferences
     */
    async savePreferences() {
        const prefs = this.getCurrentPreferences();

        // Save locally
        Storage.setPreferences(prefs);

        // Save to server if logged in
        if (Storage.getToken()) {
            try {
                await API.savePreferences(prefs);
                this.showToast('Success', 'Preferences saved', 'success');
            } catch (error) {
                this.showToast('Warning', 'Saved locally only', 'warning');
            }
        } else {
            this.showToast('Success', 'Preferences saved locally', 'success');
        }
    },

    /**
     * Load preferences
     */
    async loadPreferences() {
        let prefs = Storage.getPreferences();

        // Try to load from server if logged in
        if (Storage.getToken()) {
            try {
                const result = await API.getPreferences();
                if (result.success && result.data) {
                    prefs = result.data.preferences;
                }
            } catch (error) {
                console.log('Using local preferences');
            }
        }

        if (prefs) {
            this.applyPreferences(prefs);
        }

        this.elements.savePrefsBtn.disabled = !Storage.getToken();
    },

    /**
     * Apply preferences to UI
     */
    applyPreferences(prefs) {
        if (prefs.font) this.elements.fontSelect.value = prefs.font;
        if (prefs.textSize) {
            this.elements.textSize.value = prefs.textSize;
            this.elements.textSizeValue.textContent = prefs.textSize;
        }
        if (prefs.letterSpacing !== undefined) {
            this.elements.letterSpacing.value = prefs.letterSpacing;
            this.elements.letterSpacingValue.textContent = prefs.letterSpacing;
        }
        if (prefs.lineHeight) {
            this.elements.lineHeight.value = prefs.lineHeight;
            this.elements.lineHeightValue.textContent = prefs.lineHeight;
        }
        if (prefs.wordSpacing !== undefined) {
            this.elements.wordSpacing.value = prefs.wordSpacing;
            this.elements.wordSpacingValue.textContent = prefs.wordSpacing;
        }
        if (prefs.colorOverlay) this.elements.colorOverlay.value = prefs.colorOverlay;
        if (prefs.overlayOpacity !== undefined) {
            this.elements.overlayOpacity.value = prefs.overlayOpacity;
            this.elements.overlayOpacityValue.textContent = prefs.overlayOpacity;
        }
        if (prefs.syllableSplit !== undefined) this.elements.syllableSplit.checked = prefs.syllableSplit;
        if (prefs.distractionFree !== undefined) this.elements.distractionFree.checked = prefs.distractionFree;

        this.applyFormatting();
    },

    /**
     * Show toast notification
     */
    showToast(title, message, type = 'info') {
        this.elements.toastTitle.textContent = title;
        this.elements.toastMessage.textContent = message;
        this.elements.toast.className = `toast bg-${type} text-white`;

        const toast = new bootstrap.Toast(this.elements.toast);
        toast.show();
    },

    /**
     * Highlight word at index
     */
    highlightWord(wordIndex) {
        const words = this.elements.textContent.textContent.split(/\s+/);

        if (wordIndex < 0 || wordIndex >= words.length) return;

        // Reconstruct text with highlight
        const before = words.slice(0, wordIndex).join(' ');
        const current = words[wordIndex];
        const after = words.slice(wordIndex + 1).join(' ');

        this.elements.textContent.innerHTML =
            `${before} <span class="tts-highlight">${current}</span> ${after}`;

        // Scroll to highlighted word
        const highlight = this.elements.textContent.querySelector('.tts-highlight');
        if (highlight) {
            highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    /**
     * Clear word highlighting
     */
    clearHighlight() {
        this.updateText();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
