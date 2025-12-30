# Personal Finance Manager

A full-stack web application for managing personal finances with user authentication, transaction tracking, budget management, and reporting features.

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Recharts for data visualization

### Backend
- NestJS
- PostgreSQL with TypeORM
- JWT for authentication
- Bcrypt for password hashing

## Features

1. **User Authentication**
   - Signup & Login
   - JWT based authentication
   - Password hashing with bcrypt
   - Protected routes

2. **Transactions Management**
   - Add income and expense transactions
   - Fields: amount, type (income/expense), category, date, description
   - Categories: Food, Bills, Shopping, Salary, Petrol, etc.
   - Update existing transactions
   - Delete transactions with confirmation

3. **Transactions View**
   - Display transactions in table format
   - Color coding (Green = Income, Red = Expense)
   - Inline editing for transactions
   - Filters:
     - By month
     - By category
     - By type
     - Search by keyword

4. **Monthly Reports**
   - Total income
   - Total expenses
   - Remaining balance
   - Pie chart (category-wise expenses)

5. **Budget Tracker**
   - Monthly budget limit
   - Category-wise budget limits
   - Alerts:
     - Warning when near budget
     - Error when budget exceeded

6. **Export**
   - Export monthly report as PDF and CSV

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:
   ```
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Database Setup

1. Update the `.env` file in the `backend` directory with your database credentials
2. Ensure your PostgreSQL instance is running and accessible
3. For detailed instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md)

### Running the Application

#### Backend
```
cd backend
npm run start
```

#### Frontend
```
cd frontend
npm run start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002

## Project Structure

### Backend
```
backend/
├── src/
│   ├── entities/          # Database entities
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication module
│   │   ├── transactions/  # Transactions module
│   │   └── budgets/       # Budgets module
│   ├── dtos/              # Data Transfer Objects
│   ├── guards/            # Authentication guards
│   ├── decorators/        # Custom decorators
│   └── common/            # Shared utilities
```

### Frontend
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API service calls
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions
```

## Theme
The application uses a dark theme with black and purple accents for a modern financial dashboard look.

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License
This project is licensed under the MIT License.