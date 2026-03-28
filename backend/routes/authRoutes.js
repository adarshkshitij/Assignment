const express = require('express');
const { authorize, protect } = require('../middleware/auth');
const handleValidation = require('../middleware/validate');
const {
  registerValidation,
  loginValidation
} = require('../middleware/validators');
const {
  register,
  login,
  getMe
} = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *               adminCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', registerValidation, handleValidation, register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user and get JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, handleValidation, login);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get currently logged-in user profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authorized
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/v1/auth/admin-check:
 *   get:
 *     summary: Verify that the current user has admin access
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access confirmed
 *       403:
 *         description: User is not an admin
 */
router.get('/admin-check', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access confirmed',
    data: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

module.exports = router;
