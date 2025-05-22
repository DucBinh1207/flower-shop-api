/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - description
 *         - shortDescription
 *         - price
 *         - categoryId
 *         - image
 *       properties:
 *         id:
 *           type: integer
 *           description: Product unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: Product name
 *           example: "Sunflower Giant"
 *         slug:
 *           type: string
 *           description: Product URL slug
 *           example: "sunflower-giant"
 *         description:
 *           type: string
 *           description: Detailed product description
 *           example: "These giant sunflowers will grow up to 12 feet tall with large flower heads..."
 *         shortDescription:
 *           type: string
 *           description: Short product description for listings
 *           example: "Giant sunflower seeds that produce stunning yellow blooms"
 *         price:
 *           type: number
 *           description: Current price
 *           example: 4.99
 *         originalPrice:
 *           type: number
 *           nullable: true
 *           description: Original price before discount
 *           example: 6.99
 *         discount:
 *           type: number
 *           nullable: true
 *           description: Discount percentage
 *           example: 28
 *         categoryId:
 *           type: integer
 *           description: ID of the product's category
 *           example: 2
 *         supplierId:
 *           type: integer
 *           nullable: true
 *           description: ID of the product's supplier
 *           example: 1
 *         image:
 *           type: string
 *           description: Main product image URL
 *           example: "/images/products/sunflower-giant.jpg"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional product images
 *           example: ["/images/products/sunflower-giant-1.jpg", "/images/products/sunflower-giant-2.jpg"]
 *         rating:
 *           type: number
 *           description: Average product rating
 *           example: 4.8
 *         reviewCount:
 *           type: integer
 *           description: Number of product reviews
 *           example: 24
 *         isBestSeller:
 *           type: boolean
 *           description: Flag for bestseller products
 *           example: true
 *         isNew:
 *           type: boolean
 *           description: Flag for new products
 *           example: false
 *         stock:
 *           type: integer
 *           description: Current stock quantity
 *           example: 150
 *         packageSize:
 *           type: string
 *           description: Size of seed package
 *           example: "5g"
 *         seedCount:
 *           type: integer
 *           description: Approximate number of seeds in package
 *           example: 50
 *         howToPlant:
 *           type: string
 *           description: Instructions for planting
 *           example: "Plant seeds 1/2 inch deep in full sun. Water regularly."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when product was created
 *           example: "2023-03-15T08:30:00Z"
 *       example:
 *         id: 1
 *         name: "Sunflower Giant"
 *         slug: "sunflower-giant"
 *         description: "These giant sunflowers will grow up to 12 feet tall with large flower heads..."
 *         shortDescription: "Giant sunflower seeds that produce stunning yellow blooms"
 *         price: 4.99
 *         originalPrice: 6.99
 *         discount: 28
 *         categoryId: 2
 *         supplierId: 1
 *         image: "/images/products/sunflower-giant.jpg"
 *         images: ["/images/products/sunflower-giant-1.jpg", "/images/products/sunflower-giant-2.jpg"]
 *         rating: 4.8
 *         reviewCount: 24
 *         isBestSeller: true
 *         isNew: false
 *         stock: 150
 *         packageSize: "5g"
 *         seedCount: 50
 *         howToPlant: "Plant seeds 1/2 inch deep in full sun. Water regularly."
 *         createdAt: "2023-03-15T08:30:00Z"
 *
 *     Variant:
 *       type: object
 *       required:
 *         - productId
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Variant unique identifier
 *           example: 1
 *         productId:
 *           type: integer
 *           description: ID of the parent product
 *           example: 1
 *         name:
 *           type: string
 *           description: Variant name
 *           example: "Small Pack (10g)"
 *         sku:
 *           type: string
 *           description: Stock keeping unit
 *           example: "SUN-GNT-SM"
 *         price:
 *           type: number
 *           description: Variant price
 *           example: 4.99
 *         originalPrice:
 *           type: number
 *           nullable: true
 *           description: Original price before discount
 *           example: 6.99
 *         stock:
 *           type: integer
 *           description: Current stock quantity
 *           example: 75
 *         packageSize:
 *           type: string
 *           description: Size of seed package
 *           example: "10g"
 *         seedCount:
 *           type: integer
 *           description: Approximate number of seeds in package
 *           example: 100
 *         image:
 *           type: string
 *           nullable: true
 *           description: Variant-specific image URL
 *           example: "/images/products/sunflower-giant-small.jpg"
 *         isDefault:
 *           type: boolean
 *           description: Flag for default variant selection
 *           example: true
 *       example:
 *         id: 1
 *         productId: 1
 *         name: "Small Pack (10g)"
 *         sku: "SUN-GNT-SM"
 *         price: 4.99
 *         originalPrice: 6.99
 *         stock: 75
 *         packageSize: "10g"
 *         seedCount: 100
 *         image: "/images/products/sunflower-giant-small.jpg"
 *         isDefault: true
 *
 *     Supplier:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: Supplier unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: Supplier company name
 *           example: "GreenSeed Farms"
 *         contactPerson:
 *           type: string
 *           description: Name of primary contact person
 *           example: "John Smith"
 *         email:
 *           type: string
 *           description: Contact email address
 *           example: "contact@greenseedfarms.com"
 *         phone:
 *           type: string
 *           description: Contact phone number
 *           example: "+1 (555) 123-4567"
 *         website:
 *           type: string
 *           nullable: true
 *           description: Supplier website URL
 *           example: "https://www.greenseedfarms.com"
 *         address:
 *           type: string
 *           description: Physical address
 *           example: "123 Seed Lane, Portland, OR 97205"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Supplier description and notes
 *           example: "Organic seed producer with 25 years of experience"
 *         isActive:
 *           type: boolean
 *           description: Flag for active supplier status
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when supplier was added
 *           example: "2023-01-10T14:30:00Z"
 *       example:
 *         id: 1
 *         name: "GreenSeed Farms"
 *         contactPerson: "John Smith"
 *         email: "contact@greenseedfarms.com"
 *         phone: "+1 (555) 123-4567"
 *         website: "https://www.greenseedfarms.com"
 *         address: "123 Seed Lane, Portland, OR 97205"
 *         description: "Organic seed producer with 25 years of experience"
 *         isActive: true
 *         createdAt: "2023-01-10T14:30:00Z"
 *
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: User unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "Jane Doe"
 *         email:
 *           type: string
 *           description: User's email address
 *           example: "jane.doe@example.com"
 *         password:
 *           type: string
 *           description: User's password (hashed in the database)
 *           example: "password123"
 *         phone:
 *           type: string
 *           nullable: true
 *           description: User's phone number
 *           example: "+1 (555) 987-6543"
 *         address:
 *           type: string
 *           nullable: true
 *           description: User's shipping address
 *           example: "456 Garden Street, Portland, OR 97205"
 *         avatar:
 *           type: string
 *           nullable: true
 *           description: User's avatar image URL
 *           example: "/images/avatars/jane-doe.jpg"
 *         role:
 *           type: string
 *           enum: [admin, customer]
 *           description: User's role
 *           example: "customer"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when user was created
 *           example: "2023-02-20T10:15:00Z"
 *       example:
 *         id: 1
 *         name: "Jane Doe"
 *         email: "jane.doe@example.com"
 *         password: "password123"
 *         phone: "+1 (555) 987-6543"
 *         address: "456 Garden Street, Portland, OR 97205"
 *         avatar: "/images/avatars/jane-doe.jpg"
 *         role: "customer"
 *         createdAt: "2023-02-20T10:15:00Z"
 *
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         id:
 *           type: integer
 *           description: Category unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Vegetable Seeds"
 *         slug:
 *           type: string
 *           description: Category URL slug
 *           example: "vegetable-seeds"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Category description
 *           example: "Quality seeds for growing delicious vegetables"
 *         image:
 *           type: string
 *           nullable: true
 *           description: Category image URL
 *           example: "/images/categories/vegetable-seeds.jpg"
 *         productCount:
 *           type: integer
 *           description: Number of products in this category
 *           example: 42
 *       example:
 *         id: 1
 *         name: "Vegetable Seeds"
 *         slug: "vegetable-seeds"
 *         description: "Quality seeds for growing delicious vegetables"
 *         image: "/images/categories/vegetable-seeds.jpg"
 *         productCount: 42
 *
 *     BlogPost:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - content
 *         - authorId
 *       properties:
 *         id:
 *           type: integer
 *           description: Blog post unique identifier
 *           example: 1
 *         title:
 *           type: string
 *           description: Blog post title
 *           example: "10 Tips for Growing Perfect Tomatoes"
 *         slug:
 *           type: string
 *           description: Blog post URL slug
 *           example: "10-tips-for-growing-perfect-tomatoes"
 *         excerpt:
 *           type: string
 *           description: Short excerpt or summary
 *           example: "Learn the secrets to growing delicious, juicy tomatoes in your garden"
 *         content:
 *           type: string
 *           description: Full blog post content
 *           example: "Growing tomatoes is rewarding but can be challenging. Here are our top 10 tips..."
 *         image:
 *           type: string
 *           nullable: true
 *           description: Blog post main image URL
 *           example: "/images/blog/tomato-growing-tips.jpg"
 *         authorId:
 *           type: integer
 *           description: ID of the post author
 *           example: 2
 *         authorName:
 *           type: string
 *           description: Name of the post author
 *           example: "Sarah Johnson"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Blog post tags
 *           example: ["tomatoes", "gardening tips", "vegetables"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when post was published
 *           example: "2023-04-05T09:45:00Z"
 *       example:
 *         id: 1
 *         title: "10 Tips for Growing Perfect Tomatoes"
 *         slug: "10-tips-for-growing-perfect-tomatoes"
 *         excerpt: "Learn the secrets to growing delicious, juicy tomatoes in your garden"
 *         content: "Growing tomatoes is rewarding but can be challenging. Here are our top 10 tips..."
 *         image: "/images/blog/tomato-growing-tips.jpg"
 *         authorId: 2
 *         authorName: "Sarah Johnson"
 *         tags: ["tomatoes", "gardening tips", "vegetables"]
 *         createdAt: "2023-04-05T09:45:00Z"
 *
 *     Comment:
 *       type: object
 *       required:
 *         - productId
 *         - userId
 *         - rating
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: Comment unique identifier
 *           example: 1
 *         productId:
 *           type: integer
 *           description: ID of the product being reviewed
 *           example: 5
 *         userId:
 *           type: integer
 *           description: ID of the user posting the comment
 *           example: 8
 *         userName:
 *           type: string
 *           description: Name of the user posting the comment
 *           example: "Michael Brown"
 *         userAvatar:
 *           type: string
 *           nullable: true
 *           description: Avatar of the user posting the comment
 *           example: "/images/avatars/michael-brown.jpg"
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Product rating (1-5 stars)
 *           example: 5
 *         content:
 *           type: string
 *           description: Comment text content
 *           example: "These seeds germinated quickly and the sunflowers are growing beautifully!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when comment was posted
 *           example: "2023-06-10T11:20:00Z"
 *       example:
 *         id: 1
 *         productId: 5
 *         userId: 8
 *         userName: "Michael Brown"
 *         userAvatar: "/images/avatars/michael-brown.jpg"
 *         rating: 5
 *         content: "These seeds germinated quickly and the sunflowers are growing beautifully!"
 *         createdAt: "2023-06-10T11:20:00Z"
 *
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - customerName
 *         - customerEmail
 *         - customerPhone
 *         - shippingAddress
 *         - paymentMethod
 *         - items
 *       properties:
 *         id:
 *           type: integer
 *           description: Order unique identifier
 *           example: 1
 *         userId:
 *           type: integer
 *           description: ID of the user who placed the order
 *           example: 12
 *         customerName:
 *           type: string
 *           description: Customer's full name
 *           example: "Emily Clark"
 *         customerEmail:
 *           type: string
 *           description: Customer's email address
 *           example: "emily.clark@example.com"
 *         customerPhone:
 *           type: string
 *           description: Customer's phone number
 *           example: "+1 (555) 234-5678"
 *         shippingAddress:
 *           type: string
 *           description: Customer's shipping address
 *           example: "789 Blossom Avenue, Portland, OR 97205"
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           description: Current order status
 *           example: "processing"
 *         paymentMethod:
 *           type: string
 *           enum: [cod, bank_transfer, credit_card]
 *           description: Payment method
 *           example: "credit_card"
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *           description: Payment status
 *           example: "paid"
 *         subtotal:
 *           type: number
 *           description: Order subtotal before shipping and discount
 *           example: 45.96
 *         shippingFee:
 *           type: number
 *           description: Shipping fee
 *           example: 5.00
 *         discount:
 *           type: number
 *           description: Discount amount
 *           example: 10.00
 *         total:
 *           type: number
 *           description: Total order amount
 *           example: 40.96
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Customer notes for the order
 *           example: "Please leave package at the front door"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Items included in the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when order was placed
 *           example: "2023-07-15T14:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when order was last updated
 *           example: "2023-07-15T15:20:00Z"
 *       example:
 *         id: 1
 *         userId: 12
 *         customerName: "Emily Clark"
 *         customerEmail: "emily.clark@example.com"
 *         customerPhone: "+1 (555) 234-5678"
 *         shippingAddress: "789 Blossom Avenue, Portland, OR 97205"
 *         status: "processing"
 *         paymentMethod: "credit_card"
 *         paymentStatus: "paid"
 *         subtotal: 45.96
 *         shippingFee: 5.00
 *         discount: 10.00
 *         total: 40.96
 *         notes: "Please leave package at the front door"
 *         createdAt: "2023-07-15T14:30:00Z"
 *         updatedAt: "2023-07-15T15:20:00Z"
 *         items: [
 *           {
 *             id: 1,
 *             orderId: 1,
 *             productId: 5,
 *             productName: "Sunflower Giant",
 *             productImage: "/images/products/sunflower-giant.jpg",
 *             price: 4.99,
 *             quantity: 2,
 *             subtotal: 9.98
 *           },
 *           {
 *             id: 2,
 *             orderId: 1,
 *             productId: 12,
 *             productName: "Tomato Beefsteak",
 *             productImage: "/images/products/tomato-beefsteak.jpg",
 *             price: 3.99,
 *             quantity: 9,
 *             subtotal: 35.91
 *           }
 *         ]
 *
 *     OrderItem:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - productName
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *           description: Order item unique identifier
 *           example: 1
 *         orderId:
 *           type: integer
 *           description: ID of the parent order
 *           example: 1
 *         productId:
 *           type: integer
 *           description: ID of the purchased product
 *           example: 5
 *         productName:
 *           type: string
 *           description: Name of the purchased product
 *           example: "Sunflower Giant"
 *         productImage:
 *           type: string
 *           description: Image of the purchased product
 *           example: "/images/products/sunflower-giant.jpg"
 *         price:
 *           type: number
 *           description: Unit price at time of purchase
 *           example: 4.99
 *         quantity:
 *           type: integer
 *           description: Quantity purchased
 *           example: 2
 *         subtotal:
 *           type: number
 *           description: Total for this item (price × quantity)
 *           example: 9.98
 *       example:
 *         id: 1
 *         orderId: 1
 *         productId: 5
 *         productName: "Sunflower Giant"
 *         productImage: "/images/products/sunflower-giant.jpg"
 *         price: 4.99
 *         quantity: 2
 *         subtotal: 9.98
 */
