const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Use /tmp on Vercel (read-only filesystem), local uploads dir otherwise
const uploadDir = process.env.VERCEL
    ? '/tmp/uploads'
    : path.resolve(config.uploadDir);

// Lazily create the upload directory when needed (not at module load)
function ensureUploadDir() {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
}

/**
 * Configure multer storage
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureUploadDir(); // Create lazily, not at module load
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and add timestamp
        const sanitized = sanitizeFilename(file.originalname);
        const timestamp = Date.now();
        const ext = path.extname(sanitized);
        const name = path.basename(sanitized, ext);
        cb(null, `${name}-${timestamp}${ext}`);
    }
});

/**
 * File filter to accept only specific file types
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = /txt|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only .txt and .pdf files are allowed'), false);
    }
};

/**
 * Multer configuration
 */
const upload = multer({
    storage,
    limits: {
        fileSize: config.maxFileSize
    },
    fileFilter
});

/**
 * Sanitize filename to prevent directory traversal and other attacks
 */
function sanitizeFilename(filename) {
    // Remove path separators and special characters
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.{2,}/g, '_')
        .substring(0, 255);
}

/**
 * Delete file from filesystem
 */
function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

/**
 * Helper for S3 upload (to be implemented when needed)
 * This is a placeholder showing how to structure S3 uploads
 */
async function uploadToS3(file) {
    // Uncomment and configure when using AWS S3
    /*
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
      region: config.aws.region
    });
  
    const params = {
      Bucket: config.aws.bucketName,
      Key: `uploads/${Date.now()}-${file.originalname}`,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
      ACL: 'private'
    };
  
    const result = await s3.upload(params).promise();
    
    // Delete local file after upload
    deleteFile(file.path);
    
    return result.Location;
    */

    throw new Error('S3 upload not configured. Set AWS credentials in .env');
}

module.exports = {
    upload,
    sanitizeFilename,
    deleteFile,
    getFileSize,
    uploadToS3
};
