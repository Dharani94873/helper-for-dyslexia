const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
const auth = require('../middleware/auth');
const { upload } = require('../utils/fileHandler');

/**
 * @route   POST /documents/upload
 * @desc    Upload a file (txt or pdf)
 * @access  Private
 */
router.post(
    '/upload',
    auth,
    upload.single('file'),
    documentsController.uploadDocument
);

/**
 * @route   POST /documents/paste
 * @desc    Save pasted text
 * @access  Private
 */
router.post('/paste', auth, documentsController.pasteDocument);

/**
 * @route   GET /documents
 * @desc    Get all user documents
 * @access  Private
 */
router.get('/', auth, documentsController.getDocuments);

/**
 * @route   GET /documents/:id
 * @desc    Get a specific document
 * @access  Private
 */
router.get('/:id', auth, documentsController.getDocument);

/**
 * @route   POST /documents/:id/process
 * @desc    Save processed text
 * @access  Private
 */
router.post('/:id/process', auth, documentsController.processDocument);

/**
 * @route   PUT /documents/:id/progress
 * @desc    Update reading progress
 * @access  Private
 */
router.put('/:id/progress', auth, documentsController.updateProgress);

/**
 * @route   DELETE /documents/:id
 * @desc    Delete a document
 * @access  Private
 */
router.delete('/:id', auth, documentsController.deleteDocument);

module.exports = router;
