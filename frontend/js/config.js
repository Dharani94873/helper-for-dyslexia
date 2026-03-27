// API Configuration
const API_CONFIG = {
    // Change this to your deployed backend URL in production
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : '', // Same-origin on Vercel - frontend and backend share the same domain

    ENDPOINTS: {
        AUTH_SIGNUP: '/auth/signup',
        AUTH_LOGIN: '/auth/login',
        USER_ME: '/user/me',
        PREFERENCES_GET: '/preferences',
        PREFERENCES_SAVE: '/preferences',
        DOCUMENTS_UPLOAD: '/documents/upload',
        DOCUMENTS_PASTE: '/documents/paste',
        DOCUMENTS_LIST: '/documents',
        DOCUMENTS_GET: '/documents',
        DOCUMENTS_PROCESS: '/documents',
        DOCUMENTS_PROGRESS: '/documents',
        DOCUMENTS_DELETE: '/documents',
        ANALYTICS: '/analytics'
    }
};
