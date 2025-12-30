# Personal Finance Manager - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- PostgreSQL database
- Git

## Project Structure

The application consists of two main parts:
1. **Backend** - NestJS API in the `backend/` directory
2. **Frontend** - React application in the `frontend/` directory

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense_app
```

### 2. Database Setup

The application uses PostgreSQL as its database. You need to connect to an existing PostgreSQL instance.

1. Update the `.env` file in the `backend` directory with your database credentials
2. Ensure your PostgreSQL instance is running and accessible
3. For detailed instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md)

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm run start
```

The backend API will be available at `http://localhost:3002`

### 4. Frontend Setup

1. Open a new terminal window/tab
2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the frontend development server:
```bash
npm run start
```

The frontend application will be available at `http://localhost:3000`

## Accessing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll be redirected to the login page
3. Create a new account using the signup page
4. Login with your credentials
5. Start managing your finances!

## Features Overview

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### Dashboard
- Financial summary with income, expenses, and balance
- Visual representation of expenses by category
- Budget alerts and warnings
- Recent transactions table with edit/delete functionality

### Transactions
- Add income and expense transactions
- Edit existing transactions
- Delete transactions with confirmation
- View transaction history
- Filter transactions by:
  - Month
  - Category
  - Type (income/expense)
  - Search keywords

### Budgets
- Set monthly budget limits for different categories
- Receive warnings when approaching budget limits
- Receive alerts when exceeding budget limits

### Reports
- Monthly financial summary
- Category-wise expense visualization
- Export reports as CSV or PDF

## Theme

The application uses a modern dark theme with black and purple accents, providing a professional look suitable for a financial dashboard.

## Troubleshooting

### Database Connection Issues
- Verify the database credentials in the `.env` file in the `backend` directory
- Ensure your PostgreSQL instance is running and accessible

### Port Conflicts
- The backend runs on port 3002 by default
- The frontend runs on port 3000 by default
- You can change these in their respective configuration files

### Dependency Installation Issues
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` folders and `package-lock.json` files
- Reinstall dependencies

## Stopping the Application

### Stop the Frontend
Press `Ctrl+C` in the frontend terminal

### Stop the Backend
Press `Ctrl+C` in the backend terminal

## Development Notes

### Backend
- Built with NestJS and TypeScript
- Uses TypeORM for database interactions
- PostgreSQL database
- JWT authentication with bcrypt password hashing
- RESTful API endpoints for all features

### Frontend
- Built with React and TypeScript
- Styled with Tailwind CSS
- Uses React Router for navigation
- Responsive design for all device sizes
- Recharts for data visualization
- Axios for API communication

### Security
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes on frontend and backend
- CORS enabled for development
- Input validation on both frontend and backend

## Recent Enhancements

1. **Transaction Management**
   - Added update and delete functionality for transactions
   - Implemented confirmation dialogs for deletions
   - Added inline editing for transaction updates

2. **UI Improvements**
   - Replaced TransactionList component with TransactionTable
   - Improved responsive design
   - Added loading states for async operations
   - Enhanced error handling and user feedback

## Future Enhancements

1. Add user profile management
2. Implement data backup and restore
3. Add multi-currency support
4. Implement recurring transactions
5. Add financial goal tracking
6. Implement notifications for budget alerts