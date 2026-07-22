# 🛒 CampusCart

### A Student Marketplace for Buying and Selling Pre-Owned Products

CampusCart is a full-stack student marketplace designed to make buying and selling pre-owned products within college communities simple, affordable, and accessible.

Students can list and discover products, search by categories, connect with sellers through chat, manage wishlists and carts, and share reviews and ratings — all through one platform.



## 🚀 Problem

Students often need affordable second-hand products such as textbooks, electronics, calculators, and other college essentials. However, finding reliable buyers and sellers within a student community can be difficult.

Existing marketplaces are not specifically designed around the needs of college students.



## 💡 Our Solution

CampusCart provides a dedicated student-to-student marketplace where users can:

- List pre-owned products
- Discover products through search and categories
- View detailed product and seller information
- Connect with sellers through chat
- Save products to a wishlist
- Manage products through a shopping cart
- Leave reviews and ratings
- Track product availability and sold status

Our goal is to make student-to-student commerce more convenient, affordable, and sustainable.



## ✨ Key Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected user actions

### 📦 Product Marketplace
- Create product listings
- Edit and delete your products
- Product categories
- Search functionality
- Product availability status
- Mark products as Sold or Available

### 🔍 Product Discovery
- Browse available products
- Search for products
- Filter products by category
- View detailed product information
- View seller information

### 💬 Chat with Seller
- Direct communication between buyers and sellers
- Start a conversation from the product page
- View and send messages

### ❤️ Wishlist
- Add products to wishlist
- Remove products from wishlist
- Easily access saved products

### 🛒 Cart
- Add products to cart
- Update product quantities
- Remove products
- Checkout functionality

### ⭐ Reviews & Ratings
- View product reviews
- Submit ratings and reviews
- Reviews from verified purchasers

### 👤 User Profile
- View user information
- View listed products
- Manage personal products
- View sales and purchases

### 🖼️ Image Uploads
- Upload product images
- Cloud-based image storage using Cloudinary



## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- React Hot Toast
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST APIs

### Cloud & Deployment

- Cloudinary – Product image storage
- Render – Application deployment
- Git & GitHub – Version control

---

## 🏗️ Project Structure

text
CampusCart
│
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
│
└── README.md