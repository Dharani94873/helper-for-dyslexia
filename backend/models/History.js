const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'login',
            'signup',
            'document_upload',
            'document_view',
            'document_delete',
            'preferences_update',
            'tts_used',
            'syllable_split_used'
        ]
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

// Index for analytics queries
historySchema.index({ timestamp: -1 });
historySchema.index({ userId: 1, timestamp: -1 });
historySchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('History', historySchema);
