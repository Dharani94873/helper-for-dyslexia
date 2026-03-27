const User = require('../models/User');
const Document = require('../models/Document');
const History = require('../models/History');
const logger = require('../utils/logger');

/**
 * @route   GET /analytics
 * @desc    Get analytics data (admin only)
 * @access  Private (Admin)
 */
exports.getAnalytics = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments();
        const totalDocuments = await Document.countDocuments();

        // Get user registrations by date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUsers = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get document uploads by date
        const recentDocuments = await Document.aggregate([
            { $match: { uploadDate: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$uploadDate' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get most used actions
        const actionStats = await History.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Get total word count processed
        const wordCountStats = await Document.aggregate([
            {
                $group: {
                    _id: null,
                    totalWords: { $sum: '$wordCount' },
                    avgWords: { $avg: '$wordCount' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalDocuments,
                    totalWordsProcessed: wordCountStats[0]?.totalWords || 0,
                    avgWordsPerDocument: Math.round(wordCountStats[0]?.avgWords || 0)
                },
                userGrowth: recentUsers,
                documentUploads: recentDocuments,
                featureUsage: actionStats
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /analytics/users
 * @desc    Get user statistics
 * @access  Private (Admin)
 */
exports.getUserStats = async (req, res, next) => {
    try {
        const users = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(100);

        const roleDistribution = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                users,
                roleDistribution
            }
        });
    } catch (error) {
        next(error);
    }
};
