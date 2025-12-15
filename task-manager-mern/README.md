# Task Manager - MERN Stack Application

A full-stack Task Manager application built with MongoDB, Express, React (Vite), and Node.js

## Project Structure

```
task-manager-mern/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── jobs/
│   │   └── cron.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── TaskList.jsx
    │   │   └── FilterBar.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   ├── authService.js
    │   │   └── taskService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── .env
    ├── netlify.toml
    ├── vite.config.js
    ├── eslint.config.js
    └── package.json
```

## Features

### Authentication

- User registration with encrypted passwords (bcryptjs)
- User login with JWT token generation
- Token stored in HTTP-only cookies
- Protected routes with JWT verification middleware
- Logout functionality

### Task Management (CRUD Operations)

- **Create**: Add new tasks with title, description, status, priority, and due date
- **Read**: View all tasks or filter by status
- **Update**: Edit existing tasks
- **Delete**: Remove tasks with confirmation dialog

### Additional Features

- Filter tasks by status (all, pending, in-progress, completed)
- Task count badges for each status
- Priority levels (low, medium, high) with color indicators
- Due date tracking
- Responsive design with Tailwind CSS
- FontAwesome icons for better UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Install Server Dependencies

```bash
cd server
npm install
```

**Server Dependencies:**

- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- dotenv: Environment variables
- cors: Cross-origin resource sharing
- cookie-parser: Parse cookies

**Dev Dependencies:**

- nodemon: Auto-restart server

### 2. Install Client Dependencies

```bash
cd client
npm install
```

**Client Dependencies:**

- react: UI library
- react-dom: React DOM renderer
- react-router-dom: Routing
- axios: HTTP client

**Dev Dependencies:**

- @vitejs/plugin-react: Vite React plugin
- vite: Build tool
- tailwindcss: CSS framework
- autoprefixer: PostCSS plugin
- postcss: CSS processor

### 3. Configure Environment Variables

Create a `.env` file in the `server` folder:  

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client` folder:  

```env
VITE_BASE_URL=http://localhost:5000
```

**Important:** Change the JWT_SECRET to a strong random string in production.

### 4. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas connection string.

For local MongoDB:

```bash
mongod
```

### 5. Run the Application

**Terminal 1 - Start Server:**

```bash
cd server
npm run dev
```

Server will run on <http://localhost:5000>

**Terminal 2 - Start Client:**

```bash
cd client
npm run dev
```

Client will run on <http://localhost:5173>

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Task Routes (All Protected)

- `GET /api/tasks` - Get all tasks for logged-in user
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/status/:status` - Get tasks by status

## Key Concepts for Learning

### Backend Concepts

1. **Express Setup**: Basic server configuration with middleware
2. **MongoDB Connection**: Using Mongoose to connect to database
3. **Models**: Defining schemas for User and Task
4. **Controllers**: Separating business logic from routes
5. **Middlewares**: Authentication middleware for protected routes
6. **JWT Authentication**: Token generation and verification
7. **Password Hashing**: Using bcryptjs to secure passwords
8. **Cookies**: Storing JWT tokens in HTTP-only cookies
9. **Error Handling**: Try-catch blocks and error responses
10. **CORS**: Allowing cross-origin requests with credentials

### Frontend Concepts

1. **Vite Setup**: Fast React development environment
2. **React Router**: Navigation between pages
3. **useState & useEffect**: React hooks for state and side effects
4. **Components**: Reusable UI components
5. **Services**: API call functions separated from components
6. **Axios**: Making HTTP requests with credentials
7. **Forms**: Controlled inputs and form handling
8. **Conditional Rendering**: Showing/hiding components
9. **Props**: Passing data between components
10. **Tailwind CSS**: Utility-first CSS framework

## Security Features

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens stored in HTTP-only cookies
- Protected API routes with authentication middleware
- CORS configured to accept credentials
- Token verification on every protected request

## Testing the Application

1. Register a new user
2. Login with credentials
3. Create a new task
4. Edit the task
5. Filter tasks by status
6. Delete a task
7. Logout

## Common Issues and Solutions

### MongoDB Connection Error

- Make sure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB port (default: 27017)

### CORS Error

- Ensure client URL in server CORS config matches
- Check axios.defaults.withCredentials = true

### Token Not Being Sent

- Verify cookie-parser middleware is used
- Check axios withCredentials configuration
- Ensure CORS credentials are enabled

## Production Considerations

For production deployment, you should:

1. Use strong JWT_SECRET
2. Set NODE_ENV to 'production'
3. Use HTTPS for secure cookies
4. Add rate limiting
5. Add input validation
6. Add logging
7. Use environment-specific configurations
8. Add error monitoring
9. Implement proper error pages
10. Add loading states and error boundaries

## Learning Resources

- Express Documentation: <https://expressjs.com/>
- MongoDB Documentation: <https://docs.mongodb.com/>
- Mongoose Documentation: <https://mongoosejs.com/>
- React Documentation: <https://react.dev/>
- Vite Documentation: <https://vitejs.dev/>
- Tailwind CSS Documentation: <https://tailwindcss.com/>
