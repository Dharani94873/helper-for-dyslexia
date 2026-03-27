const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Font settings
    font: {
        type: String,
        enum: ['default', 'opendyslexic', 'lexend'],
        default: 'default'
    },
    textSize: {
        type: Number,
        min: 12,
        max: 32,
        default: 16
    },
    // Spacing settings
    letterSpacing: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    lineHeight: {
        type: Number,
        min: 1.0,
        max: 3.0,
        default: 1.5
    },
    wordSpacing: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    // Color overlay
    colorOverlay: {
        type: String,
        default: 'none' // 'none', 'blue', 'yellow', 'green', 'pink'
    },
    overlayOpacity: {
        type: Number,
        min: 0,
        max: 100,
        default: 20
    },
    // Features
    syllableSplit: {
        type: Boolean,
        default: false
    },
    distractionFree: {
        type: Boolean,
        default: false
    },
    // TTS settings
    ttsVoice: {
        type: String,
        default: 'default'
    },
    ttsRate: {
        type: Number,
        min: 0.5,
        max: 2.0,
        default: 1.0
    },
    ttsPitch: {
        type: Number,
        min: 0.5,
        max: 2.0,
        default: 1.0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
preferenceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Preference', preferenceSchema);
