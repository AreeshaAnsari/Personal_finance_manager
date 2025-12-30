# Finance Manager - Database Setup

This project uses PostgreSQL as the database. You need to connect to an existing PostgreSQL instance.

## Setting up PostgreSQL

1. Update the `.env` file in the `backend` directory with your database credentials
2. Ensure your PostgreSQL instance is running and accessible
3. The application will automatically connect using the credentials in the `.env` file

## Environment Variables

The following environment variables are used for database configuration:

- `DB_HOST`: Database host (default: `localhost`)
- `DB_PORT`: Database port (default: `5432`)
- `DB_USERNAME`: Database username (default: `postgres`)
- `DB_PASSWORD`: Database password (default: `postgres`)
- `DB_NAME`: Database name (default: `finance_manager`)
- `JWT_SECRET`: Secret key for JWT token generation

## Database Connection

The application uses TypeORM to connect to the PostgreSQL database. Make sure your PostgreSQL server is running and accessible with the provided credentials.