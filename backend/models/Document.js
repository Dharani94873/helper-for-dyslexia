const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['txt', 'pdf', 'pasted'],
        required: true
    },
    filePath: {
        type: String, // Local path or S3 URL
        default: null
    },
    rawText: {
        type: String,
        required: true
    },
    processedText: {
        type: String, // Text with syllable splits or other processing
        default: null
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    readingProgress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    wordCount: {
        type: Number,
        default: 0
    }
});

// Calculate word count before saving
documentSchema.pre('save', function (next) {
    if (this.isModified('rawText')) {
        this.wordCount = this.rawText.split(/\s+/).filter(word => word.length > 0).length;
    }
    next();
});

// Update lastAccessed when document is retrieved
documentSchema.methods.updateAccess = async function () {
    this.lastAccessed = Date.now();
    await this.save();
};

// Create indexes for faster queries
documentSchema.index({ userId: 1, uploadDate: -1 });
documentSchema.index({ userId: 1, title: 'text' });

module.exports = mongoose.model('Document', documentSchema);
