# 🏡 WanderLust - Full Stack Vacation Rental Platform

WanderLust is a feature-rich, full-stack web application inspired by Airbnb. It allows users to explore, list, review, and search for unique vacation stays worldwide with interactive maps and dynamic category filtering.

---

## ✨ Key Features

- 🏡 **Listing Management**: Create, edit, update, and delete property listings with Cloudinary image uploads.
- 🗺️ **Interactive Maps**: Powered by **Leaflet.js** and **OpenStreetMap** geocoding for location mapping and custom interactive map popups.
- 🏷️ **Category Filtering**: Easily filter stays across categories: **Trending**, **Rooms**, **Iconic Cities**, **Mountains**, **Castles**, **Amazing Pools**, **Camping**, **Farms**, and **Arctic**.
- 🔍 **Global Search**: Search properties by title, city, country, or category.
- ⭐️ **Ratings & Reviews**: User review system with 5-star ratings powered by Starability CSS.
- 🔒 **Authentication & Authorization**: Secure signup, login, session management via Passport.js, and strict owner permission checks for editing/deleting properties.
- 💰 **Tax Toggle**: Interactive switch to toggle listing prices with/without GST (+18%).
- ☁️ **Cloud Storage**: Seamless image management using Cloudinary and Multer.
- 🚀 **Serverless Ready**: Pre-configured for deployment on **Vercel** (`vercel.json`) and **Render**.

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js** & **Express.js** (v5)
- **MongoDB** & **Mongoose** (ODM)
- **Passport.js** (Authentication with Local Strategy)
- **Express-Session** & **Connect-Mongo** (Session Store)
- **Node-Geocoder** (OpenStreetMap Geocoding)

### **Frontend**
- **EJS** & **EJS-Mate** (Layouts & Templating)
- **Bootstrap 5** & **FontAwesome 7**
- **Leaflet.js** (Interactive Maps)
- **Starability.css** (Rating System)
- **Vanilla CSS3** & HTML5

### **Cloud & Deployment**
- **Cloudinary** & **Multer** (File Uploads & Image Storage)
- **Vercel** & **Render** (Cloud Hosting)

---

## 📁 Directory Structure

```text
MajorProject/
├── controllers/          # Request handler controllers (listings, reviews, users)
├── models/               # Mongoose Schemas (Listing, Review, User)
├── routes/               # Express routes (listing, review, user)
├── views/                # EJS templates & layouts
│   ├── includes/         # Partial templates (navbar, footer, flash)
│   ├── layouts/          # Boilerplate layout
│   └── listings/         # Listing views (index, show, new, edit)
├── public/               # Static assets
│   ├── css/              # Custom styling & rating CSS
│   └── js/               # Client-side map & validation scripts
├── init/                 # Database seed data & initialization scripts
├── utils/                # ExpressError & Async wrapper utilities
├── app.js                # Main Express server entry point
├── cloudConfig.js        # Cloudinary setup
├── schema.js             # Joi server-side validation schemas
└── vercel.json           # Vercel deployment configuration
```

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### 2. Clone the Repository
```bash
git clone https://github.com/arpit797/Major-Project.git
cd Major-Project
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=8080
SECRET=your_super_secret_key
STORE_SECRET=your_session_store_secret

# MongoDB Connection
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 5. Seed the Database
Populate local/Atlas database with sample listings, category metadata, and coordinates:
```bash
node init/index.js
```

### 6. Start the Server
```bash
node app.js
```
Open `http://localhost:8080/listings` in your browser.

---

## 🌐 Deployment

### Deploying on **Vercel**
1. Import this repository on [Vercel](https://vercel.com).
2. Set Environment Variables (`ATLASDB_URL`, `SECRET`, `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`).
3. Ensure MongoDB Atlas IP Whitelist includes `0.0.0.0/0`.
4. Deploy! (`vercel.json` automatically routes requests to `app.js`).

---

## 📜 License
This project is open source and available under the [ISC License](LICENSE).
