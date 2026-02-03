# Rateify - Store Rating Platform

A full-stack web application called **Rateify** that allows users to submit ratings for stores registered on the platform with role-based access control.

## Features

**Rateify** is a comprehensive store rating platform with the following features:

- **User Registration & Authentication** with role-based access
- **Store Management** for administrators
- **Rating System** (1-5 stars) with user reviews
- **Dashboard** for different user roles
- **Search & Filter** functionality
- **Responsive Design** for all devices

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React.js** with **Vite**
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## Features

### User Roles
1. **System Administrator**
   - Dashboard with statistics (total users, stores, ratings)
   - User management (create, view, filter users)
   - Store management (create, view stores)
   - Advanced filtering and sorting

2. **Normal User**
   - User registration and login
   - View all registered stores
   - Search stores by name and address
   - Submit/modify ratings (1-5 stars)
   - Password change functionality

3. **Store Owner**
   - View store dashboard
   - See average rating and total ratings
   - View list of users who rated their store
   - Password change functionality

## Database Schema

### Tables
- **users** (id, name, email, password, address, role, created_at)
- **stores** (id, name, email, address, owner_id, created_at)
- **ratings** (id, user_id, store_id, rating, created_at, updated_at)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FullStackIntern_CodingChallenge
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database configuration:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rating_platform
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   PORT=5000
   ```

4. **Set up the database**
   ```bash
   # Create database and run the SQL script
   psql -U your_username -c "CREATE DATABASE rating_platform;"
   psql -U your_username -d rating_platform -f database.sql
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Default Credentials

### Admin User
- **Email**: rajesh.sharma@rating.in
- **Password**: India@123

### Sample Store Owners
- **Email**: priyanka.singh@techstore.in (Password: India@123)
- **Email**: amitabh.kumar@fashion.in (Password: India@123)
- **Email**: deepika.padukone@restaurant.in (Password: India@123)

### Sample Normal Users
- **Email**: vijay.kumar@customer.in (Password: India@123)
- **Email**: anjali.sharma@customer.in (Password: India@123)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/change-password` - Change password

### Admin Routes (Protected)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users` - Get users with filtering/sorting
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/stores` - Create new store
- `GET /api/admin/stores` - Get stores with filtering/sorting

### User Routes (Protected)
- `GET /api/user/stores` - Get stores with filtering/sorting
- `POST /api/user/ratings` - Submit rating
- `PUT /api/user/ratings/:id` - Update rating

### Store Owner Routes (Protected)
- `GET /api/owner/dashboard` - Get store dashboard
- `GET /api/owner/ratings` - Get store ratings

## Validation Rules

### Backend Validation
- **Name:** 20-60 characters
- **Email:** Valid email format
- **Password:** 8-16 characters, at least one uppercase letter and one special character
- **Address:** Maximum 400 characters
- **Rating:** Integer between 1-5

### Frontend Validation
Same rules as backend with real-time validation feedback

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection prevention (using parameterized queries)

## Project Structure

```
FullStackIntern_CodingChallenge/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── userController.js
│   │   └── ownerController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── user.js
│   │   └── owner.js
│   ├── .env.example
│   ├── database.sql
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── StoreManagement.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Usage

1. **Start both servers** (backend on port 5000, frontend on port 5173)
2. **Open browser** and navigate to `http://localhost:5173`
3. **Login** with default admin credentials or register as a new user
4. **Navigate** through the dashboard based on your role

## Development

### Adding New Features
1. Backend: Add routes in `/routes`, controllers in `/controllers`
2. Frontend: Add components in `/src/components`, update routing in `App.jsx`
3. Database: Update `database.sql` for schema changes

### Testing
- Test API endpoints using Postman or similar tools
- Test frontend functionality in browser
- Verify role-based access control

## License

This project is for educational purposes as part of a coding challenge.
