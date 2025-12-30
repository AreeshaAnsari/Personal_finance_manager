# Database Schema

## Overview
The Personal Finance Manager application uses PostgreSQL as its database with the following tables:

## Tables

### 1. Users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the user |
| email | VARCHAR | UNIQUE, NOT NULL | User's email address |
| password | VARCHAR | NOT NULL | Hashed password |
| firstName | VARCHAR | NOT NULL | User's first name |
| lastName | VARCHAR | NOT NULL | User's last name |
| createdAt | TIMESTAMP | DEFAULT NOW() | Timestamp when the user was created |

### 2. Transactions
Stores income and expense transactions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the transaction |
| amount | DECIMAL(10,2) | NOT NULL | Transaction amount |
| type | ENUM | NOT NULL | Transaction type: 'income' or 'expense' |
| category | ENUM | NOT NULL | Transaction category (Food, Bills, etc.) |
| date | DATE | NOT NULL | Date of the transaction |
| description | TEXT | OPTIONAL | Description of the transaction |
| userId | INTEGER | FOREIGN KEY | References Users(id) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Timestamp when the transaction was created |

### 3. Budgets
Stores monthly budget limits for categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for the budget |
| amount | DECIMAL(10,2) | NOT NULL | Budget amount |
| category | ENUM | NOT NULL | Budget category (Food, Bills, etc.) |
| month | DATE | NOT NULL | Month for which the budget applies |
| userId | INTEGER | FOREIGN KEY | References Users(id) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Timestamp when the budget was created |

## Enums

### TransactionType
- 'income'
- 'expense'

### TransactionCategory
- 'Food'
- 'Bills'
- 'Shopping'
- 'Salary'
- 'Petrol'
- 'Entertainment'
- 'Healthcare'
- 'Travel'
- 'Other'

## Relationships

1. **Users ↔ Transactions**: One-to-Many
   - One user can have many transactions
   - Each transaction belongs to one user

2. **Users ↔ Budgets**: One-to-Many
   - One user can have many budgets
   - Each budget belongs to one user

## Indexes

1. **Users.email**: UNIQUE index for fast email lookups
2. **Transactions.userId**: Index for fast user-based queries
3. **Transactions.date**: Index for date-based queries
4. **Budgets.userId**: Index for fast user-based queries
5. **Budgets.month**: Index for month-based queries

## Notes

- All monetary amounts are stored as DECIMAL(10,2) to ensure precision
- Dates are stored as DATE type for transactions and budgets
- Passwords are hashed using bcrypt before storage
- The application uses TypeORM for database interactions