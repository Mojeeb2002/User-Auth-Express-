/**
 * @swagger
 * api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       200:
 *         description: Successful login
 */

/**
 * @swagger
 * api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *               username:
 *                 type: string
 *                 description: Desired username
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               phone:
 *                 type: string
 *                 description: Phone number of the user
 *               password:
 *                 type: string
 *                 description: Password for the account
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful logout
 */

/**
 * @swagger
 * api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 */

/**
 * @swagger
 * api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user requesting the reset
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 */

/**
 * @swagger
 * api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                  type: string
 *                  description: Email address of the user
 *              code:
 *                 type: string
 *                 description: Password reset code sent to the user's email
 *              newPassword:
 *                 type: string
 *                 description: New password to set
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
