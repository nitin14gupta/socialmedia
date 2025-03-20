# Endpoints

## Auth

POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user

## Posts

POST /api/posts - Create a new post
GET /api/posts/user/${userId} - Get user's posts
GET /api/posts/feed - Get feed posts
POST /api/posts/${postId}/like - Like/Unlike a post
POST /api/posts/${postId}/comment - Add a comment
DELETE /api/posts/${postId} - Delete a post