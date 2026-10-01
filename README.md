Multi-Vendor E-Commerce Marketplace

A full-stack multi-vendor e-commerce marketplace built with React, Node.js, Express.js, and MySQL.

The application supports three roles — Buyer, Vendor, and Admin — with role-based access control, product management, stock management, order processing, payments, payouts, reviews, returns, and reporting.

---

🚀 Features

🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- Unauthorized access handling
- Roles:
  - Admin
  - Vendor
  - Buyer

🛍️ Buyer Features

- Browse products
- Search products
- Filter products by category
- View product details
- View product images
- Add products to cart
- Update/remove cart items
- Checkout
- Shipping address
- Mock payment processing
- Order history
- Order details
- Order tracking
- Product reviews and ratings
- Return requests

🏪 Vendor Features

- Vendor dashboard
- Create products
- Edit products
- Delete products
- Upload product images
- Stock management
- View customer orders
- Fulfill orders
- Order tracking
- View payouts

👨‍💼 Admin Features

- Admin dashboard
- Vendor approval and status management
- Product/catalog moderation
- Order oversight
- Order status management
- Payout processing
- Sales and order reports
- User and role management
- Audit logging
- Return/refund management

---

🛠️ Technology Stack

Frontend

- React
- Vite
- React Router
- Axios
- CSS

Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Multer
- CORS

Database

- MySQL
- mysql2

---

📁 Project Structure

Multi-Vendor -Marketplace
│
├── backend
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── src
│   │   ├── controllers
│   │   └── routes
│   │
│   ├── uploads
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
│
└── frontend
    └── frontend
        ├── src
        │   ├── components
        │   ├── context
        │   ├── pages
        │   ├── routes
        │   ├── services
        │   ├── styles
        │   ├── App.jsx
        │   └── index.css
        │
        ├── package.json
        └── vite.config.js

---

⚙️ Installation & Setup

1. Clone or extract the project

Open the project folder in VS Code.

2. Backend Setup

Open a terminal:

cd backend

Install dependencies:

npm install

Create/configure the ".env" file with the required database and JWT settings.

Example:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=marketplace
JWT_SECRET=your_secret_key

Make sure MySQL is running and the required database/tables are created.

Start the backend:

npm start

The backend runs on:

http://localhost:5000

---

3. Frontend Setup

Open another terminal:

cd frontend/frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

Vite will display the local frontend URL, for example:

http://localhost:5173

If that port is already in use, Vite may automatically select another port.

---

🔑 Demo Login Accounts

The login page provides demo login options for testing.

Admin

Email: admin@marketplace.com
Password: Admin@123
Role: Admin

Vendor

Email: vendor@marketplace.com
Password: Vendor@123
Role: Vendor

Buyer

Email: buyer@marketplace.com
Password: Buyer@123
Role: Buyer

«These credentials are intended for local development/testing only.»

---

🖼️ Product Image Upload

Vendors can upload product images while creating or editing products.

Supported formats:

JPG
JPEG
PNG
WEBP

Maximum file size:

5 MB

Uploaded images are stored in the backend "uploads" directory and served through:

/uploads/<filename>

---

🔒 Security

The application includes:

- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- Protected API routes
- Vendor ownership/isolation checks
- Input validation
- Centralized error handling
- Audit logging

---

💳 Payment

The project uses a mock payment system for development and testing.

The checkout flow includes:

1. Create order
2. Initiate payment
3. Process mock payment
4. Handle payment webhook
5. Confirm payment
6. Display order confirmation

No real payment gateway is required for this project.

---

📦 Order Flow

Buyer

Browse Products
      ↓
Add to Cart
      ↓
Checkout
      ↓
Payment
      ↓
Order Created
      ↓
Track Order

Vendor

Receive Order
      ↓
Process Order
      ↓
Fulfill Order
      ↓
Update Order Status
      ↓
Tracking

Admin

Monitor Orders
      ↓
Review Status
      ↓
Manage Payouts
      ↓
View Reports

---

💰 Vendor Payouts

The system supports:

- Order amount calculation
- Commission calculation
- Vendor payout calculation
- Payout status management
- Admin payout processing

---

⭐ Reviews

Buyers can submit reviews for products they have purchased.

Features include:

- Rating from 1–5 stars
- Written comments
- Review listing
- Review deletion by the review owner

---

🔄 Returns & Refunds

The marketplace supports:

- Buyer return requests
- Vendor return management
- Admin return/refund management
- Return status tracking

---

📊 Reports

Admin reports include sales and order information such as:

- Total orders
- Total sales
- Average order value
- Order-level information

---

🧪 Testing

The project was tested for:

- Authentication
- Role-based access
- Vendor isolation
- Product CRUD
- Image upload
- Stock management
- Cart operations
- Checkout
- Payment flow
- Order processing
- Vendor fulfillment
- Admin management
- Payouts
- Reviews
- Returns

---

🌐 API Base URL

http://localhost:5000/api

---

📌 Important Notes

- Start MySQL before starting the backend.
- Start the backend before using frontend API features.
- Keep the backend terminal running while testing the frontend.
- Product images are stored locally in the "backend/uploads" directory.
- The payment system is a mock implementation for development/testing.
- Do not commit the ".env" file or real credentials to a public repository.

---

👩‍💻 Project

Project: Multi-Vendor E-Commerce Marketplace

Architecture: Full Stack

Frontend: React + Vite

Backend: Node.js + Express.js

Database: MySQL

Authentication: JWT + bcrypt

Image Upload: Multer

Payment: Mock Payment

---

