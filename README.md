# TrendShift Backend

Backend server for TrendShift social platform built with Node.js, Express, and MongoDB.

## Features

- User Authentication (JWT)
- Post Management
- Comment System
- Like/Unlike functionality
- Admin Dashboard

## Prerequisites
- Node.js (v16.14.0 or later)
- MongoDB Atlas account

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   - `PORT`: Server port (default: 5000)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long, random string for JWT tokens
   - `JWT_EXPIRE`: Token expiration time

## Running the Application
- Development mode:
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

## Deployment
- Supports deployment on Glitch, Netlify, and similar platforms
- Ensure all environment variables are set in the deployment platform

## Environment Variables
- `NODE_ENV`: Application environment (production/development)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Posts
- GET /api/posts - Get all posts
- POST /api/posts - Create new post (admin)
- PATCH /api/posts/:id - Update post (admin)
- DELETE /api/posts/:id - Delete post (admin)
- POST /api/posts/:id/like - Like/Unlike post

### Comments
- POST /api/comments/:postId - Add comment
- PATCH /api/comments/:id - Update comment
- DELETE /api/comments/:id - Delete comment
- POST /api/comments/:id/like - Like/Unlike comment

## Troubleshooting
- Check MongoDB connection string
- Verify environment variables
- Ensure Node.js version compatibility
