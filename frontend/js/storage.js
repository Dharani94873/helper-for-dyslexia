/**
 * LocalStorage Helper Module
 * Manages authentication tokens and offline data
 */

const Storage = {
    /**
     * Get authentication token
     */
    getToken() {
        return localStorage.getItem('dyslexia_token');
    },

    /**
     * Set authentication token
     */
    setToken(token) {
        localStorage.setItem('dyslexia_token', token);
    },

    /**
     * Get user data
     */
    getUser() {
        const user = localStorage.getItem('dyslexia_user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Set user data
     */
    setUser(user) {
        localStorage.setItem('dyslexia_user', JSON.stringify(user));
    },

    /**
     * Clear authentication data
     */
    clearAuth() {
        localStorage.removeItem('dyslexia_token');
        localStorage.removeItem('dyslexia_user');
    },

    /**
     * Get saved preferences
     */
    getPreferences() {
        const prefs = localStorage.getItem('dyslexia_preferences');
        return prefs ? JSON.parse(prefs) : null;
    },

    /**
     * Save preferences
     */
    setPreferences(preferences) {
        localStorage.setItem('dyslexia_preferences', JSON.stringify(preferences));
    },

    /**
     * Get current document ID
     */
    getCurrentDocument() {
        return localStorage.getItem('dyslexia_current_document');
    },

    /**
     * Set current document ID
     */
    setCurrentDocument(documentId) {
        localStorage.setItem('dyslexia_current_document', documentId);
    },

    /**
     * Clear current document
     */
    clearCurrentDocument() {
        localStorage.removeItem('dyslexia_current_document');
    },

    /**
     * Cache document locally
     */
    cacheDocument(documentId, documentData) {
        const cache = this.getDocumentCache() || {};
        cache[documentId] = {
            data: documentData,
            timestamp: Date.now()
        };
        localStorage.setItem('dyslexia_doc_cache', JSON.stringify(cache));
    },

    /**
     * Get cached document
     */
    getCachedDocument(documentId) {
        const cache = this.getDocumentCache();
        if (cache && cache[documentId]) {
            return cache[documentId].data;
        }
        return null;
    },

    /**
     * Get all document cache
     */
    getDocumentCache() {
        const cache = localStorage.getItem('dyslexia_doc_cache');
        return cache ? JSON.parse(cache) : null;
    },

    /**
     * Clear document cache
     */
    clearDocumentCache() {
        localStorage.removeItem('dyslexia_doc_cache');
    },

    /**
     * Clear all data
     */
    clearAll() {
        localStorage.clear();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
