/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API for dashboard overview
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get dashboard overview data (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrder:
 *                       type: integer
 *                       example: 120
 *                     totalPendingOrder:
 *                       type: integer
 *                       example: 15
 *                     totalIncome:
 *                       type: number
 *                       example: 10320.50
 *                     currentMonthIncome:
 *                       type: number
 *                       example: 2450.00
 *                     totalUser:
 *                       type: integer
 *                       example: 350
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /dashboard/recent-orders:
 *   get:
 *     summary: Get 10 most recent orders (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the 10 most recent orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /dashboard/statistics:
 *   get:
 *     summary: get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thống kê tổng quan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProduct:
 *                   type: integer
 *                   example: 120
 *                 totalCategory:
 *                   type: integer
 *                   example: 5
 *                 orderCompletionRate:
 *                   type: number
 *                   format: float
 *                   description: Tỷ lệ hoàn thành đơn hàng (0 - 1)
 *                   example: 0.85
 *                 productTypePerCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: "Trang điểm"
 *                       count:
 *                         type: integer
 *                         example: 30
 */
