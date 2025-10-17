# BlogApp 📝

A modern, full-stack blogging platform built with React and Node.js, featuring rich text editing, social interactions, and comprehensive analytics.


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [License](#license)

## 🌟 Overview

BlogApp is a feature-rich blogging platform that enables users to create, share, and discover engaging content. With its intuitive interface and powerful features, it provides a seamless experience for both content creators and readers.

## ✨ Features

### User Management
- 🔐 **Authentication & Authorization**: Secure JWT-based authentication
- 👤 **User Profiles**: Customizable profiles with avatars
- 👥 **Follow System**: Follow/unfollow other users
- 🔔 **Notifications**: Get notified about likes, comments, follows, and milestones
- 📊 **User Analytics**: Track your posts' performance

### Content Creation & Management
- ✍️ **Rich Text Editor**: Create beautiful posts with React Quill
- 🖼️ **Thumbnail Support**: Add custom thumbnails to posts
- 🏷️ **Tags & Categories**: Organize content with multiple tags and categories
- 📝 **CRUD Operations**: Create, read, update, and delete posts
- 💾 **Draft Management**: Save and edit posts before publishing

### Social Interactions
- ❤️ **Like System**: Like/unlike posts
- 💬 **Comments**: Engage with posts through comments
- 🔖 **Bookmarks**: Save favorite posts for later reading
- 📈 **Trending Algorithm**: Smart trending system based on views, likes, and comments
- 📊 **View Counter**: Track post popularity with view counts

### Discovery & Search
- 🔍 **Global Search**: Search across posts, users, categories, and tags
- 🔥 **Trending Page**: Discover popular content
- 📂 **Category Filtering**: Browse posts by category
- 🏷️ **Tag Filtering**: Filter posts by tags
- 👤 **Following Feed**: See posts from users you follow

### Analytics & Insights
- 📈 **Post Analytics**: Track views, likes, and comments over time
- 📊 **Interactive Charts**: Visualize data with Recharts
- 📉 **Growth Metrics**: Compare performance across different time periods
- 🎯 **Category Distribution**: See which categories are most popular
- ⏱️ **Time Filters**: Analyze data by 24h, 7d, 30d, or all time

### Admin Features ⚙️
- 🚧 **Coming Soon**: Admin dashboard with advanced management capabilities

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: Validator.js
- **API Documentation**: Swagger/OpenAPI
- **Development**: Nodemon for hot reloading



### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM v7.8.2
- **Styling**: Tailwind CSS v4.1.12
- **State Management**: TanStack Query (React Query) v5.85.8
- **HTTP Client**: Axios
- **Rich Text Editor**: React Quill
- **Charts**: Recharts v3.2.1
- **Icons**: Lucide React, React Icons
- **Notifications**: React Toastify
- **Authentication**: JWT Decode


## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```powershell
   git clone https://github.com/tsunflowerr/BlogApp.git
   cd BlogApp
   ```

2. **Navigate to backend directory**
   ```powershell
   cd backend
   ```

3. **Install dependencies**
   ```powershell
   npm install
   ```

4. **Create environment file**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the backend server**
   ```powershell
   npm start
   ```
   
   The backend will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```powershell
   cd ../frontend
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the development server**
   ```powershell
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173` (or another port specified by Vite)

### Build for Production

**Frontend:**
```powershell
cd frontend
npm run build
```

The build files will be generated in the `dist` folder.

## 📚 API Documentation

Once the backend server is running, you can access the interactive API documentation at:

```
http://localhost:4000/api-docs
```

### Main API Endpoints

#### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

#### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:postId` - Get single post by ID
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:postId` - Update post (auth required)
- `DELETE /api/posts/:postId` - Delete post (auth required)
- `POST /api/posts/:postId/like` - Like/unlike post (auth required)
- `GET /api/posts/category/:slug` - Get posts by category
- `GET /api/posts/tag/:slug` - Get posts by tag

#### Comments
- `POST /api/:postId/comments` - Add comment (auth required)
- `GET /api/:postId/comments` - Get post comments
- `PUT /api/comments/:commentId` - Update comment (auth required)
- `DELETE /api/comments/:commentId` - Delete comment (auth required)

#### User Interactions
- `POST /api/users/follow/:userId` - Follow/unfollow user (auth required)
- `POST /api/users/bookmark/:postId` - Bookmark/unbookmark post (auth required)
- `GET /api/users/bookmarks` - Get user bookmarks (auth required)

#### Categories & Tags
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags
- `POST /api/categories` - Create category (auth required)
- `POST /api/tags` - Create tag (auth required)

#### Search & Notifications
- `GET /api/search?q=query` - Search posts, users, categories, tags
- `GET /api/notification` - Get user notifications (auth required)
- `PUT /api/notification/:id/read` - Mark notification as read (auth required)

## 📸 Screenshots

## Login Page
<p align="center">
  <img src="https://github.com/user-attachments/assets/72042d91-cc76-47f7-853a-6137646d2a45" alt="Login" width="800"/>
</p>

*Secure authentication page with JWT token-based login, featuring email and password fields, gradient background (green to sky), and options to switch to signup.*

---

## Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/2b8a5b1e-8a1d-451b-9125-6e15e485dea6" alt="Dashboard" width="800"/>
</p>

*Main dashboard with post creation and feed.*

---

## Post Detail
<p align="center">
  <img src="https://github.com/user-attachments/assets/92810a96-e02f-4adb-8187-e63fca0dc348" alt="Post Detail" width="800"/>
</p>

*Detailed post view with comments and interactions.*

---

## Analytics
<p align="center">
  <img src="https://github.com/user-attachments/assets/b204843e-5f28-4ca8-a415-21de86e02385" alt="Analytics" width="800"/>
</p>

*Comprehensive analytics with charts and metrics.*

---

## Trending
<p align="center">
  <img src="https://github.com/user-attachments/assets/2d422eb5-4596-4ff5-9c33-f55b681dc96d" alt="Trending" width="800"/>
</p>

*Discover trending posts based on engagement.*

---

## Profile
<p align="center">
  <img src="https://github.com/user-attachments/assets/e9d3d87c-3ea5-4a42-b39a-4e5a15fe0768" alt="Profile" width="800"/>
</p>

*User profile with posts and followers.*

---

## Search
<p align="center">
  <img src="https://github.com/user-attachments/assets/6130a7b5-5a72-42b8-9161-a3d678d0e2c2" alt="Search" width="800"/>
</p>

*Global search across all content types.*

## 🔑 Key Features Explained

### Trending Algorithm
The trending page uses a sophisticated algorithm that considers:
- **Views**: Number of times the post has been viewed
- **Likes**: Total likes received
- **Comments**: Engagement through comments
- **Time decay**: Recent posts are prioritized

Formula:
```
trendingScore = (w_views × views + w_likes × likes + w_comments × comments) / (hoursSincePost + 2)^1.5
```

### View Tracking
- Intelligent IP-based view tracking
- 1-hour cooldown per unique viewer
- Milestone notifications (every 10 views)

### Notification System
Automatic notifications for:
- New likes on your posts
- Comments on your posts
- New followers
- View milestones (10, 20, 30... views)

## 🔒 Authentication Flow

1. User registers or logs in
2. Server validates credentials
3. JWT token is generated and sent to client
4. Client stores token in localStorage
5. Token is included in subsequent requests via Authorization header
6. Server validates token using middleware
7. Protected routes are accessible with valid token

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Gradient Backgrounds**: Beautiful gradient backgrounds for auth pages
- **Smooth Animations**: Enhanced user experience with smooth transitions
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Clear loading indicators for better UX
- **Error Handling**: Comprehensive error messages and validation

## 🚧 Coming Soon

### Admin Features
- User management dashboard
- Content moderation tools
- System analytics
- Role-based access control
- Featured posts management
- Category and tag management UI
- Report handling system

## 📝 License

This project is open source and available under the

## 👨‍💻 Author

**tsunflowerr**

- GitHub: [@tsunflowerr](https://github.com/tsunflowerr)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- MongoDB for the flexible database
- All contributors and users of this project

---

<div align="center">
  <p>Made with ❤️ by tsunflowerr</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
