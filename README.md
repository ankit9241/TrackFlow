# TrackFlow - Habit Tracking Application

TrackFlow is a modern, full-stack habit tracking application designed to help users build and maintain positive habits. Built with the MERN stack (MongoDB, Express.js, React, Node.js), TrackFlow provides an intuitive interface for users to track their daily habits, visualize progress, and achieve their personal goals.

## Features

- **User Authentication** - Secure signup and login with JWT
- **Habit Management** - Create, update, and track daily habits
- **Progress Visualization** - Interactive charts to track habit completion over time
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode** - Eye-friendly interface with dark theme support
- **Daily Reminders** - Email notifications for habit tracking
- **Streak Tracking** - Maintain and extend habit streaks

## Tech Stack

### Frontend
- **React 19** - Frontend library for building user interfaces
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization library
- **Framer Motion** - Animation library for React
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email notifications

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- MongoDB (local or cloud instance)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/trackflow.git
cd trackflow
```

### 2. Set Up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Set Up Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
trackflow/
├── backend/               # Backend server code
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── server.js     # Express server setup
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
│
└── frontend/             # Frontend React application
    ├── public/           # Static files
    └── src/
        ├── assets/       # Images, fonts, etc.
        ├── components/   # Reusable UI components
        ├── pages/        # Page components
        ├── App.jsx       # Root component
        └── main.jsx      # Entry point
```

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Backend
Deploy the backend to your preferred hosting service (e.g., Render, Heroku, or AWS). Make sure to set up the required environment variables in your hosting platform.

### Frontend
Deploy the frontend to a static hosting service like Netlify, Vercel, or GitHub Pages. The project includes a `netlify.toml` configuration file for easy deployment to Netlify.

## Environment Variables

### Backend (`.env`)
- `PORT` - Port to run the server on (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `CLIENT_URL` - URL of the frontend application
- `NODE_ENV` - Environment (development/production)

### Frontend (`.env`)
- `VITE_API_URL` - URL of the backend API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ using the MERN stack
- Inspired by popular habit tracking applications
- Special thanks to all contributors

---

**TrackFlow** - Build Better Habits, One Day at a Time
