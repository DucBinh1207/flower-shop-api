/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin) or current user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: customerPhone
 *         schema:
 *           type: string
 *         description: Filter by customer phone number (supports partial match)
 *     responses:
 *       200:
 *         description: A list of orders
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
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     totalCount:
 *                       type: integer
 *                       example: 28
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *               - customerPhone
 *               - shippingAddress
 *               - paymentMethod
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Customer's full name
 *                 example: "Emily Clark"
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 description: Customer's email address
 *                 example: "emily.clark@example.com"
 *               customerPhone:
 *                 type: string
 *                 description: Customer's phone number
 *                 example: "+1 (555) 234-5678"
 *               shippingAddress:
 *                 type: string
 *                 description: Customer's shipping address
 *                 example: "789 Blossom Avenue, Portland, OR 97205"
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, bank_transfer, credit_card]
 *                 description: Payment method
 *                 example: "credit_card"
 *               notes:
 *                 type: string
 *                 description: Customer notes for the order
 *                 example: "Please leave package at the front door"
 *               items:
 *                 type: array
 *                 description: Items to be ordered
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID of the product
 *                       example: 5
 *                     variantId:
 *                       type: integer
 *                       description: ID of the product variant (if applicable)
 *                       example: 12
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantity to order
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data or insufficient stock
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or order owner only
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an order's status (Admin only or Owner to cancel)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 description: Order status
 *                 example: shipped
 *             required:
 *               - status
 *
 *     responses:
 *       200:
 *         description: Order updated successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only or not owner
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 example: "Changed my mind about the order"
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cannot cancel order in current state
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or order owner only
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *
 * /orders/user/{userId}:
 *   get:
 *     summary: Get orders by user ID (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of orders for the user
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
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     totalCount:
 *                       type: integer
 *                       example: 5
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *
 * /orders/stats:
 *   get:
 *     summary: Get order statistics (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for stats (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for stats (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Order statistics
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
 *                     totalOrders:
 *                       type: integer
 *                       example: 120
 *                     totalRevenue:
 *                       type: number
 *                       example: 5678.45
 *                     averageOrderValue:
 *                       type: number
 *                       example: 47.32
 *                     statusCounts:
 *                       type: object
 *                       properties:
 *                         pending:
 *                           type: integer
 *                           example: 15
 *                         processing:
 *                           type: integer
 *                           example: 25
 *                         shipped:
 *                           type: integer
 *                           example: 35
 *                         delivered:
 *                           type: integer
 *                           example: 40
 *                         cancelled:
 *                           type: integer
 *                           example: 5
 *                     monthlySales:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "2023-07"
 *                           count:
 *                             type: integer
 *                             example: 42
 *                           revenue:
 *                             type: number
 *                             example: 1985.75
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 * /orders/{id}/status:
 *   put:
 *     summary: Update an order's status (Admin only or Owner to cancel)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 description: Order status
 *                 example: shipped
 *             required:
 *               - status
 *
 *     responses:
 *       200:
 *         description: Order updated successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only or not owner
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *
 */
