/**
 * API Communication Module
 * Handles all backend API calls
 */

const API = {
    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const token = Storage.getToken();

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, mergedOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    /**
     * Authentication: Signup
     */
    async signup(name, email, password) {
        const result = await this.request(API_CONFIG.ENDPOINTS.AUTH_SIGNUP, {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (result.success && result.data) {
            Storage.setToken(result.data.token);
            Storage.setUser(result.data.user);
        }

        return result;
    },

    /**
     * Authentication: Login
     */
    async login(email, password) {
        const result = await this.request(API_CONFIG.ENDPOINTS.AUTH_LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result.success && result.data) {
            Storage.setToken(result.data.token);
            Storage.setUser(result.data.user);
        }

        return result;
    },

    /**
     * Get current user profile
     */
    async getProfile() {
        return await this.request(API_CONFIG.ENDPOINTS.USER_ME);
    },

    /**
     * Get user preferences
     */
    async getPreferences() {
        const result = await this.request(API_CONFIG.ENDPOINTS.PREFERENCES_GET);

        if (result.success && result.data) {
            Storage.setPreferences(result.data.preferences);
        }

        return result;
    },

    /**
     * Save user preferences
     */
    async savePreferences(preferences) {
        const result = await this.request(API_CONFIG.ENDPOINTS.PREFERENCES_SAVE, {
            method: 'POST',
            body: JSON.stringify(preferences)
        });

        if (result.success && result.data) {
            Storage.setPreferences(result.data.preferences);
        }

        return result;
    },

    /**
     * Upload document file
     */
    async uploadDocument(file, title = '') {
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);

        const token = Storage.getToken();

        return await this.request(API_CONFIG.ENDPOINTS.DOCUMENTS_UPLOAD, {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
                // Don't set Content-Type for FormData
            },
            body: formData
        });
    },

    /**
     * Save pasted text as document
     */
    async pasteDocument(text, title = 'Pasted Text') {
        return await this.request(API_CONFIG.ENDPOINTS.DOCUMENTS_PASTE, {
            method: 'POST',
            body: JSON.stringify({ text, title })
        });
    },

    /**
     * Get all user documents
     */
    async getDocuments() {
        return await this.request(API_CONFIG.ENDPOINTS.DOCUMENTS_LIST);
    },

    /**
     * Get specific document
     */
    async getDocument(documentId) {
        const result = await this.request(`${API_CONFIG.ENDPOINTS.DOCUMENTS_GET}/${documentId}`);

        if (result.success && result.data) {
            Storage.cacheDocument(documentId, result.data.document);
        }

        return result;
    },

    /**
     * Save processed text
     */
    async saveProcessedText(documentId, processedText) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DOCUMENTS_PROCESS}/${documentId}/process`, {
            method: 'POST',
            body: JSON.stringify({ processedText })
        });
    },

    /**
     * Update reading progress
     */
    async updateProgress(documentId, progress) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DOCUMENTS_PROGRESS}/${documentId}/progress`, {
            method: 'PUT',
            body: JSON.stringify({ progress })
        });
    },

    /**
     * Delete document
     */
    async deleteDocument(documentId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DOCUMENTS_DELETE}/${documentId}`, {
            method: 'DELETE'
        });
    },

    /**
     * Get analytics (admin only)
     */
    async getAnalytics() {
        return await this.request(API_CONFIG.ENDPOINTS.ANALYTICS);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
