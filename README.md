# Dumb CRM

A simple CRM (Customer Relationship Management) system built with Fastify and Prisma.

## Features

- **Customers**: Manage customer information with name, email, phone, and company
- **Contacts**: Track contacts associated with customers
- **Deals**: Manage sales deals with status tracking and value
- **Clean Architecture**: Separated database layer from routes
- **RESTful API**: Full CRUD operations for all entities

## Tech Stack

- **Fastify**: Fast and low overhead web framework
- **Prisma**: Modern database toolkit with type safety
- **SQLite**: Lightweight database (easily configurable for other databases)

## Project Structure

```
├── db/                    # Database layer (stored procedures)
│   ├── customers.js      # Customer database operations
│   ├── contacts.js       # Contact database operations
│   └── deals.js          # Deal database operations
├── routes/               # API routes
│   ├── customers.js      # Customer endpoints
│   ├── contacts.js       # Contact endpoints
│   └── deals.js          # Deal endpoints
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── api/         # API client and endpoints
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app with routing
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
├── main.js               # Backend application entry point
├── config.js             # Configuration management
└── package.json          # Backend dependencies and scripts
```

## Setup

### Backend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="file:./dev.db"
   PORT=3000
   HOST="0.0.0.0"
   ```

3. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

4. **Set up the database**:
   ```bash
   npm run db:push
   ```

5. **Start the backend server**:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Set up frontend environment**:
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3001`

### Running Both Services

To run both backend and frontend simultaneously:

1. **Terminal 1** (Backend):
   ```bash
   npm run dev
   ```

2. **Terminal 2** (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

Access the application at `http://localhost:3001`

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/search?q=query` - Search customers

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `GET /api/contacts/customer/:customerId` - Get contacts by customer
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Deals
- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get deal by ID
- `GET /api/deals/customer/:customerId` - Get deals by customer
- `GET /api/deals/status/:status` - Get deals by status
- `GET /api/deals/stats` - Get deal statistics
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Utility
- `GET /health` - Health check
- `GET /` - API information

## Database Schema

The CRM includes three main entities:

- **Customer**: Core customer information
- **Contact**: Contacts associated with customers
- **Deal**: Sales deals with status and value tracking

## Development

- **Database Studio**: `npm run db:studio` - Open Prisma Studio
- **Database Migrations**: `npm run db:migrate` - Create and apply migrations
- **Database Push**: `npm run db:push` - Push schema changes to database

## Architecture Notes

This CRM follows a clean architecture pattern where:

1. **Database Layer** (`db/`): Contains all database operations as "stored procedures"
2. **Routes Layer** (`routes/`): Handles HTTP requests and responses
3. **Main Application** (`main.js`): Orchestrates the application setup

This separation ensures that business logic is isolated from HTTP concerns and makes the codebase more maintainable and testable.