/**
 * Notification Routes
 * API endpoints for lead notifications
 */

const express = require('express');
const router = express.Router();
const { sendNotification } = require('../services/notificationService');
const { getStatus } = require('../services/whatsappService');
const { getTrackedCount } = require('../utils/duplicateTracker');

/**
 * POST /api/notify
 * Send a WhatsApp notification for a lead
 */
router.post('/notify', async (req, res) => {
    try {
        const lead = req.body;

        // Basic request validation
        if (!lead || Object.keys(lead).length === 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Request body is required'
            });
        }

        // Process notification
        const result = await sendNotification(lead);

        // Determine HTTP status based on result
        let httpStatus = 200;
        if (result.status === 'FAILED') {
            httpStatus = 503; // Service unavailable
        } else if (result.status === 'SKIPPED') {
            httpStatus = 200; // OK but skipped
        }

        return res.status(httpStatus).json(result);

    } catch (error) {
        console.error('❌ Error processing notification:', error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Internal server error',
            error: error.message
        });
    }
});

/**
 * GET /api/status
 * Get WhatsApp client status
 */
router.get('/status', (req, res) => {
    const status = getStatus();
    const trackedLeads = getTrackedCount();

    res.json({
        whatsapp: status.connected ? 'connected' : 'disconnected',
        phoneInfo: status.info ? {
            pushname: status.info.pushname,
            phone: status.info.wid?.user
        } : null,
        trackedLeads
    });
});

/**
 * POST /notifications/register-token
 * Register FCM token for push notifications
 */
router.post('/notifications/register-token', (req, res) => {
    const { fcmToken } = req.body;
    
    if (!fcmToken) {
        return res.status(400).json({
            status: 'ERROR',
            message: 'FCM Token is required'
        });
    }

    // In a real app, save this to the User model or a separate DeviceTokens table
    console.log(`[FCM] Registered token: ${fcmToken.substring(0, 20)}...`);

    return res.status(200).json({
        success: true,
        message: 'Token registered successfully'
    });
});

module.exports = router;
