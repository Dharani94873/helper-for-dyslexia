require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Preference = require('../models/Preference');
const Document = require('../models/Document');
const History = require('../models/History');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Seed script to populate database with initial data
 * Run with: npm run seed
 */

const seedData = async () => {
    try {
        // Connect to database
        await mongoose.connect(config.mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info('Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing data)
        await User.deleteMany({});
        await Preference.deleteMany({});
        await Document.deleteMany({});
        await History.deleteMany({});
        logger.info('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'Admin123!',
            role: 'admin'
        });
        logger.info('Created admin user: admin@example.com / Admin123!');

        // Create demo user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'user@example.com',
            password: 'User123!',
            role: 'user'
        });
        logger.info('Created demo user: user@example.com / User123!');

        // Create preferences for demo user
        await Preference.create({
            userId: demoUser._id,
            font: 'opendyslexic',
            textSize: 18,
            letterSpacing: 2,
            lineHeight: 2.0,
            wordSpacing: 3,
            colorOverlay: 'blue',
            overlayOpacity: 25,
            syllableSplit: true,
            distractionFree: false
        });
        logger.info('Created preferences for demo user');

        // Create sample documents for demo user
        const sampleText1 = `Reading is a fundamental skill that opens doors to knowledge and imagination. 
For people with dyslexia, reading can present unique challenges. However, with the right tools 
and support, reading can become more accessible and enjoyable. This application provides various 
features to help make text easier to read, including customizable fonts, spacing adjustments, 
color overlays, and text-to-speech functionality.`;

        const sampleText2 = `The quick brown fox jumps over the lazy dog. This sentence contains every 
letter of the English alphabet. Dyslexia affects the way the brain processes written and spoken 
language. People with dyslexia may have difficulty with phonological processing, rapid naming, 
working memory, and processing speed. Despite these challenges, many successful individuals 
have dyslexia and have found ways to work with their unique learning style.`;

        const doc1 = await Document.create({
            userId: demoUser._id,
            title: 'Welcome to Accessibility Helper',
            fileName: 'welcome.txt',
            fileType: 'txt',
            rawText: sampleText1,
            processedText: sampleText1.split(' ').join('‧'),
            readingProgress: 35
        });

        const doc2 = await Document.create({
            userId: demoUser._id,
            title: 'Understanding Dyslexia',
            fileName: 'dyslexia-info.txt',
            fileType: 'txt',
            rawText: sampleText2,
            readingProgress: 0
        });

        logger.info(`Created ${2} sample documents for demo user`);

        // Create some history entries
        await History.create([
            {
                userId: demoUser._id,
                action: 'signup'
            },
            {
                userId: demoUser._id,
                action: 'login'
            },
            {
                userId: demoUser._id,
                action: 'document_upload',
                metadata: { documentId: doc1._id, fileType: 'txt' }
            },
            {
                userId: demoUser._id,
                action: 'document_view',
                metadata: { documentId: doc1._id }
            },
            {
                userId: demoUser._id,
                action: 'preferences_update',
                metadata: { updatedFields: ['font', 'textSize', 'syllableSplit'] }
            },
            {
                userId: demoUser._id,
                action: 'syllable_split_used'
            },
            {
                userId: demoUser._id,
                action: 'tts_used'
            }
        ]);
        logger.info('Created history entries');

        // Summary
        logger.info('\n========================================');
        logger.info('Database seeded successfully!');
        logger.info('========================================');
        logger.info('\nLogin credentials:');
        logger.info('Admin: admin@example.com / Admin123!');
        logger.info('Demo User: user@example.com / User123!');
        logger.info('========================================\n');

        // Close connection
        await mongoose.connection.close();
        logger.info('Database connection closed');
        process.exit(0);

    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed function
seedData();
