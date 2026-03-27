const fs = require('fs').promises;
const path = require('path');
// NOTE: pdf-parse is required lazily inside uploadDocument() to avoid
// serverless crash (pdf-parse reads test files on module load)
const Document = require('../models/Document');
const History = require('../models/History');
const { deleteFile } = require('../utils/fileHandler');
const logger = require('../utils/logger');

/**
 * @route   POST /documents/upload
 * @desc    Upload and parse a document (txt or pdf)
 * @access  Private
 */
exports.uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { title } = req.body;
        const file = req.file;
        let rawText = '';

        // Extract text based on file type
        if (file.mimetype === 'application/pdf') {
            const pdfParse = require('pdf-parse'); // Lazy require - avoids serverless crash
            const dataBuffer = await fs.readFile(file.path);
            const pdfData = await pdfParse(dataBuffer);
            rawText = pdfData.text;
        } else if (file.mimetype === 'text/plain') {
            rawText = await fs.readFile(file.path, 'utf-8');
        } else {
            // Clean up uploaded file
            deleteFile(file.path);
            return res.status(400).json({
                success: false,
                message: 'Unsupported file type'
            });
        }

        // Create document record
        const document = await Document.create({
            userId: req.user._id,
            title: title || file.originalname,
            fileName: file.originalname,
            fileType: path.extname(file.originalname).substring(1),
            filePath: file.path,
            rawText
        });

        // Log document upload
        await History.create({
            userId: req.user._id,
            action: 'document_upload',
            metadata: { documentId: document._id, fileType: document.fileType }
        });

        logger.info(`Document uploaded by user ${req.user.email}: ${document.title}`);

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: { document }
        });
    } catch (error) {
        // Clean up file if processing failed
        if (req.file) {
            try {
                deleteFile(req.file.path);
            } catch (e) {
                logger.error('Failed to delete file after error:', e);
            }
        }
        next(error);
    }
};

/**
 * @route   POST /documents/paste
 * @desc    Save pasted text as a document
 * @access  Private
 */
exports.pasteDocument = async (req, res, next) => {
    try {
        const { title, text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Text content is required'
            });
        }

        const document = await Document.create({
            userId: req.user._id,
            title: title || 'Pasted Text',
            fileName: 'pasted.txt',
            fileType: 'pasted',
            rawText: text
        });

        logger.info(`Pasted text saved by user ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Text saved successfully',
            data: { document }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /documents
 * @desc    Get all documents for current user
 * @access  Private
 */
exports.getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({ userId: req.user._id })
            .sort({ uploadDate: -1 })
            .select('-rawText -processedText'); // Exclude large text fields

        res.json({
            success: true,
            count: documents.length,
            data: { documents }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /documents/:id
 * @desc    Get a specific document
 * @access  Private
 */
exports.getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Update last accessed
        await document.updateAccess();

        // Log document view
        await History.create({
            userId: req.user._id,
            action: 'document_view',
            metadata: { documentId: document._id }
        });

        res.json({
            success: true,
            data: { document }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /documents/:id/process
 * @desc    Save processed text for a document
 * @access  Private
 */
exports.processDocument = async (req, res, next) => {
    try {
        const { processedText } = req.body;

        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        document.processedText = processedText;
        await document.save();

        res.json({
            success: true,
            message: 'Processed text saved',
            data: { document }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /documents/:id/progress
 * @desc    Update reading progress
 * @access  Private
 */
exports.updateProgress = async (req, res, next) => {
    try {
        const { progress } = req.body;

        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        document.readingProgress = Math.min(100, Math.max(0, progress));
        await document.save();

        res.json({
            success: true,
            message: 'Progress updated',
            data: { document }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /documents/:id
 * @desc    Delete a document
 * @access  Private
 */
exports.deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Delete physical file if exists
        if (document.filePath) {
            try {
                deleteFile(document.filePath);
            } catch (e) {
                logger.warn('Failed to delete physical file:', e.message);
            }
        }

        await Document.deleteOne({ _id: document._id });

        // Log deletion
        await History.create({
            userId: req.user._id,
            action: 'document_delete',
            metadata: { documentId: document._id, title: document.title }
        });

        logger.info(`Document deleted by user ${req.user.email}: ${document.title}`);

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
