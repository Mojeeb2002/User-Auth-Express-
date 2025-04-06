
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */

/**
 * @swagger
 * /users/update-email:
 *   post:
 *     summary: Update user email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated successfully
 */

/**
 * @swagger
 * /users/update-password:
 *   post:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              currentPassword:
 *                 type: string
 *              newPassword:
 *                type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */

/**
 * @swagger
 * /users/update-user:
 *   post:
 *     summary: Update user information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information updated successfully
 */
