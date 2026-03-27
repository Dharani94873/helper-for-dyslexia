const config = require('../config/config');

/**
 * Simple logger utility
 * In production, consider using winston or bunyan
 */
class Logger {
    constructor() {
        this.isDevelopment = config.nodeEnv === 'development';
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
    }

    info(message, meta) {
        console.log(this.formatMessage('info', message, meta));
    }

    warn(message, meta) {
        console.warn(this.formatMessage('warn', message, meta));
    }

    error(message, meta) {
        console.error(this.formatMessage('error', message, meta));
    }

    debug(message, meta) {
        if (this.isDevelopment) {
            console.debug(this.formatMessage('debug', message, meta));
        }
    }
}

module.exports = new Logger();
