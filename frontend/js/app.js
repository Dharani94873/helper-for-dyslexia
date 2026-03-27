/**
 * Main Application Bootstrap
 * Coordinates all modules and initializes the application
 */

(function () {
    'use strict';

    // Application state
    const App = {
        initialized: false,
        currentDocumentId: null,

        /**
         * Initialize application
         */
        init() {
            if (this.initialized) return;

            console.log('Initializing Dyslexia Helper...');

            // Initialize modules
            UI.init();
            TTS.init();
            PDFExtractor.init();

            // Setup app-level event listeners
            this.setupEventListeners();

            // Check authentication
            this.checkAuth();

            // Load document if specified
            this.loadCurrentDocument();

            // Add keyboard shortcuts
            this.setupKeyboardShortcuts();

            this.initialized = true;
            console.log('Application initialized successfully');
        },

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Paste button and modal
            const pasteBtn = document.getElementById('pasteBtn');
            const confirmPaste = document.getElementById('confirmPaste');

            if (pasteBtn) {
                pasteBtn.addEventListener('click', () => {
                    const modal = new bootstrap.Modal(document.getElementById('pasteModal'));
                    modal.show();
                });
            }

            if (confirmPaste) {
                confirmPaste.addEventListener('click', async () => {
                    const text = document.getElementById('pastedText').value;
                    const title = document.getElementById('pastedTitle').value || 'Pasted Text';

                    if (text.trim()) {
                        UI.loadText(text, title);

                        // Save to server if logged in
                        if (Storage.getToken()) {
                            try {
                                await API.pasteDocument(text, title);
                                UI.showToast('Success', 'Text saved to your account', 'success');
                            } catch (error) {
                                console.error('Failed to save pasted text:', error);
                            }
                        }

                        // Close modal
                        bootstrap.Modal.getInstance(document.getElementById('pasteModal')).hide();
                        document.getElementById('pastedText').value = '';
                        document.getElementById('pastedTitle').value = '';
                    }
                });
            }

            // TTS controls
            const ttsPlay = document.getElementById('ttsPlay');
            const ttsPause = document.getElementById('ttsPause');
            const ttsStop = document.getElementById('ttsStop');
            const ttsStatus = document.getElementById('ttsStatus');

            if (ttsPlay) {
                ttsPlay.addEventListener('click', () => {
                    const text = UI.currentText;

                    if (!text) {
                        UI.showToast('Warning', 'No text to read', 'warning');
                        return;
                    }

                    const started = TTS.play(text,
                        (wordIndex, word) => {
                            UI.highlightWord(wordIndex);
                            ttsStatus.textContent = `Reading: ${word}`;
                        },
                        () => {
                            UI.clearHighlight();
                            ttsStatus.textContent = 'Finished';
                            ttsPause.disabled = true;
                            ttsStop.disabled = true;
                        }
                    );

                    if (started) {
                        ttsStatus.textContent = 'Reading...';
                        ttsPause.disabled = false;
                        ttsStop.disabled = false;
                    }
                });
            }

            if (ttsPause) {
                ttsPause.addEventListener('click', () => {
                    const status = TTS.getStatus();

                    if (status.isPaused) {
                        TTS.resume();
                        ttsStatus.textContent = 'Reading...';
                        ttsPause.innerHTML = '<i class="bi bi-pause-fill"></i>';
                    } else {
                        TTS.pause();
                        ttsStatus.textContent = 'Paused';
                        ttsPause.innerHTML = '<i class="bi bi-play-fill"></i>';
                    }
                });
            }

            if (ttsStop) {
                ttsStop.addEventListener('click', () => {
                    TTS.stop();
                    UI.clearHighlight();
                    ttsStatus.textContent = 'Stopped';
                    ttsPause.disabled = true;
                    ttsStop.disabled = true;
                    ttsPause.innerHTML = '<i class="bi bi-pause-fill"></i>';
                });
            }

            // Logout button
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        },

        /**
         * Setup keyboard shortcuts
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Spacebar: Play/Pause TTS (when not in input field)
                if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                    e.preventDefault();
                    const ttsPlay = document.getElementById('ttsPlay');
                    const ttsPause = document.getElementById('ttsPause');

                    if (!ttsPlay.disabled) {
                        const status = TTS.getStatus();
                        if (status.isPlaying) {
                            ttsPause.click();
                        } else {
                            ttsPlay.click();
                        }
                    }
                }

                // Escape: Stop TTS or exit distraction-free mode
                if (e.code === 'Escape') {
                    const status = TTS.getStatus();
                    if (status.isPlaying) {
                        document.getElementById('ttsStop').click();
                    } else if (document.getElementById('distractionFree').checked) {
                        document.getElementById('distractionFree').click();
                    }
                }

                // Ctrl/Cmd + S: Save preferences
                if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
                    e.preventDefault();
                    const saveBtn = document.getElementById('savePrefsBtn');
                    if (!saveBtn.disabled) {
                        saveBtn.click();
                    }
                }
            });
        },

        /**
         * Check authentication status
         */
        checkAuth() {
            const token = Storage.getToken();
            const user = Storage.getUser();

            const loginLink = document.getElementById('loginLink');
            const logoutLink = document.getElementById('logoutLink');
            const dashboardLink = document.getElementById('dashboardLink');
            const savePrefsBtn = document.getElementById('savePrefsBtn');

            if (token && user) {
                // User is logged in
                if (loginLink) loginLink.style.display = 'none';
                if (logoutLink) logoutLink.style.display = 'block';
                if (dashboardLink) dashboardLink.style.display = 'block';
                if (savePrefsBtn) savePrefsBtn.disabled = false;
            } else {
                // User is not logged in
                if (loginLink) loginLink.style.display = 'block';
                if (logoutLink) logoutLink.style.display = 'none';
                if (dashboardLink) dashboardLink.style.display = 'none';
                if (savePrefsBtn) savePrefsBtn.disabled = true;
            }
        },

        /**
         * Load current document if specified
         */
        async loadCurrentDocument() {
            const documentId = Storage.getCurrentDocument();

            if (!documentId) return;

            try {
                // Try to get from cache first
                let document = Storage.getCachedDocument(documentId);

                // If not in cache, fetch from server
                if (!document && Storage.getToken()) {
                    const result = await API.getDocument(documentId);
                    if (result.success) {
                        document = result.data.document;
                    }
                }

                if (document) {
                    UI.loadText(document.rawText, document.title);
                    UI.showToast('Info', `Loaded: ${document.title}`, 'info');
                }

                // Clear the current document marker
                Storage.clearCurrentDocument();
            } catch (error) {
                console.error('Failed to load document:', error);
                UI.showToast('Error', 'Failed to load document', 'danger');
                Storage.clearCurrentDocument();
            }
        },

        /**
         * Logout user
         */
        logout() {
            Storage.clearAuth();
            UI.showToast('Success', 'Logged out successfully', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

    // Export for debugging
    window.DyslexiaHelperApp = App;

})();
