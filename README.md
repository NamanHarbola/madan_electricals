Madan Electricals - Full-Stack E-commerce Store
Madan Electricals is a feature-rich, full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a complete shopping experience for customers and a powerful, intuitive admin panel for store management.

Live Demo Links:

Frontend (Vercel): https://www.madanelectricals.com/

Backend (Render): https://madan-electricals-backend.onrender.com/

Features
Customer-Facing Features
Modern & Responsive UI: A clean and fully responsive design built with React and custom CSS.

Product Browsing & Search: Users can browse products by category or use the search bar to find specific items.

Product Details: Each product has a dedicated page with multiple images, description, pricing, stock status, and customer reviews.

Shopping Cart: A persistent shopping cart to add, remove, and update item quantities.

Secure Checkout:

Integrated with Razorpay for secure online payments.

Cash on Delivery (COD) option available.

User Authentication:

Secure local authentication with JWT (JSON Web Tokens).

Google OAuth 2.0 for easy social login.

User Profiles: Registered users have a profile page to view their order history and manage their shipping details.

Product Reviews: Logged-in users can submit ratings and comments on products they've purchased.

Admin Panel Features
Advanced Dashboard: An analytical dashboard showcasing key metrics like total sales, orders, customers, and live website viewers via Google Analytics integration.

Sales & Product Charts: Visual charts for sales trends and top-selling products.

Order Management: View all orders, see customer details (including phone number), and update order status (e.g., Pending, Shipped, Delivered).

Product Management (CRUD):

Add, edit, and delete products.

Upload multiple product images via Cloudinary.

Duplicate Product feature to easily copy existing products.

Category Management (CRUD): Create, edit, and delete product categories.

Customer Management: View a list of all registered customers.

Content Management:

Manage homepage promotional banners.

Update the "About Us" page content directly from the admin panel.

Protected Routes: Admin routes are protected to ensure only authorized users have access.

Tech Stack
Category	Technology
Frontend	React, React Router, Vite, Axios, Chart.js, React Toastify, Custom CSS
Backend	Node.js, Express.js, Mongoose
Database	MongoDB
Auth	JWT, bcryptjs, Passport.js (Google OAuth 2.0)
Payments	Razorpay
File Storage	Cloudinary for image uploads
Deployment	Frontend: Vercel, Backend: Render

Export to Sheets
Getting Started
Prerequisites
Node.js (v18.x or higher)

npm or yarn

MongoDB (local instance or a cloud service like MongoDB Atlas)

Cloudinary Account (for image hosting)

Razorpay Account (for payments)

Google Cloud Platform project with OAuth 2.0 credentials enabled

Installation & Setup
Clone the repository:

Bash

git clone https://github.com/namanharbola/madan_electricals.git
cd madan_electricals
Setup the Backend:

Bash

cd madan-store-backend
npm install
Create a .env file in the madan-store-backend directory and add the environment variables listed below.

Setup the Frontend:

Bash

cd ../madan-store-frontend
npm install
Create a .env file in the madan-store-frontend directory and add the environment variables listed below.

Environment Variables
You will need to create .env files for both the frontend and backend.

Backend (madan-store-backend/.env)
Code snippet

MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
JWT_SECRET=<YOUR_JWT_SECRET>
SESSION_SECRET=<YOUR_EXPRESS_SESSION_SECRET>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>

# Razorpay
RAZORPAY_KEY_ID=<YOUR_RAZORPAY_KEY_ID>
RAZORPAY_KEY_SECRET=<YOUR_RAZORPAY_KEY_SECRET>

# Google OAuth
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
BACKEND_URL=http://localhost:5000

# Google Analytics (Optional)
GA_PROPERTY_ID=<YOUR_GA4_PROPERTY_ID>
Frontend (madan-store-frontend/.env)
Code snippet

VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY=<YOUR_RAZORPAY_KEY_ID>
Running the Application
Start the Backend Server:

Bash

# From the madan-store-backend directory
npm run dev
The backend server will be running on http://localhost:5000.

Start the Frontend Development Server:

Bash

# From the madan-store-frontend directory
npm run dev
The frontend application will be available at http://localhost:5173.

Author
Naman Harbola

GitHub

LinkedIn
