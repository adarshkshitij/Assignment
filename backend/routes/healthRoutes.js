const express = require('express');
const { getHealth } = require('../controllers/healthController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/', getHealth);

module.exports = router;
