# Dumb CRM

A modern, full-stack CRM (Customer Relationship Management) system built with Fastify, React, and Prisma. Features authentication, user management, and a clean, responsive UI.

## ✨ Features

### Core CRM Features
- **Customers**: Manage customer information with name, email, phone, and company
- **Contacts**: Track contacts associated with customers
- **Deals**: Manage sales deals with status tracking and value
- **Dashboard**: Overview with statistics and quick actions

### Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Admin and user roles with proper access control
- **Protected Routes**: Frontend route protection with automatic redirects
- **Password Security**: Bcrypt hashing for secure password storage

### Technical Features
- **RESTful API**: Full CRUD operations for all entities
- **Real-time UI**: React with modern hooks and context
- **Responsive Design**: Mobile-friendly Tailwind CSS styling
- **Database Migrations**: Proper schema versioning with Prisma
- **Health Monitoring**: Built-in health checks and monitoring
- **CORS Support**: Proper cross-origin request handling

## 🛠 Tech Stack

### Backend
- **Fastify**: Fast and low overhead web framework
- **Prisma**: Modern database toolkit with type safety
- **PostgreSQL**: Production-ready database (SQLite for development)
- **JWT**: Secure authentication tokens
- **Bcrypt**: Password hashing

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing with protection
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client with interceptors
- **React Hot Toast**: User feedback notifications

### Testing
- **Jest**: Backend testing framework
- **Vitest**: Frontend testing framework
- **React Testing Library**: Component testing
- **Supertest**: API endpoint testing

## 📁 Project Structure

```
├── db/                    # Database layer (stored procedures)
│   ├── users.js          # User authentication operations
│   ├── customers.js      # Customer database operations
│   ├── contacts.js       # Contact database operations
│   └── deals.js          # Deal database operations
├── routes/               # API routes
│   ├── auth.js           # Authentication endpoints
│   ├── users.js          # User management endpoints
│   ├── customers.js      # Customer endpoints
│   ├── contacts.js       # Contact endpoints
│   └── deals.js          # Deal endpoints
├── middleware/           # Custom middleware
│   └── auth.js           # Authentication middleware
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── api/         # API client and endpoints
│   │   ├── components/  # Reusable React components
│   │   ├── contexts/    # React context providers
│   │   ├── pages/       # Page components
│   │   ├── __tests__/   # Frontend tests
│   │   └── App.jsx      # Main app with routing
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
├── tests/               # Backend tests
│   ├── auth.test.js     # Authentication tests
│   └── api.test.js      # API endpoint tests
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema definition
│   └── migrations/      # Database migrations
├── main.js              # Backend application entry point
├── config.js            # Configuration management
├── render.yaml          # Render deployment configuration
└── package.json         # Backend dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)

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
   JWT_SECRET="your-super-secret-jwt-key"
   NODE_ENV="development"
   ```

3. **Set up the database**:
   ```bash
   npm run dev:setup
   ```

4. **Start the backend server**:
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

### Default Admin Account

After first startup, you can log in with:
- **Email**: `admin@dumbcrm.com`
- **Password**: `admin123`

**⚠️ Important**: Change the default password after first login!

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/register` - Register new user (admin only)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/toggle-status` - Toggle user status

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

## 🗄️ Database Schema

The CRM includes four main entities:

- **User**: Authentication and user management
- **Customer**: Core customer information
- **Contact**: Contacts associated with customers
- **Deal**: Sales deals with status and value tracking

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Architecture Notes

This CRM follows a clean architecture pattern where:

1. **Database Layer** (`db/`): Contains all database operations as "stored procedures"
2. **Routes Layer** (`routes/`): Handles HTTP requests and responses
3. **Middleware Layer** (`middleware/`): Authentication and other middleware
4. **Main Application** (`main.js`): Orchestrates the application setup

This separation ensures that business logic is isolated from HTTP concerns and makes the codebase more maintainable and testable.

## 🚀 Deployment

### Render Deployment

This application is configured for easy deployment to Render using `render.yaml`. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy Steps:**
1. Push code to GitHub
2. Connect repository to Render
3. Render will automatically detect and deploy using `render.yaml`
4. Set up environment variables
5. Test your live CRM!

### Environment Variables

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (auto-generated on Render)
- `NODE_ENV`: Set to `production`

**Frontend:**
- `VITE_API_URL`: Your deployed backend URL

### Database

- **Development**: SQLite (local file)
- **Production**: PostgreSQL (Render managed)

The Prisma schema automatically adapts to the database provider based on the `DATABASE_URL` environment variable.

## 🎯 Roadmap

### Planned Features
- [ ] File uploads for customer documents
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] API rate limiting
- [ ] Caching with Redis
- [ ] Background job processing
- [ ] Real-time updates with WebSockets

### Current Status
- ✅ Authentication and authorization
- ✅ User management
- ✅ Customer, contact, and deal management
- ✅ Responsive UI
- ✅ Testing suite
- ✅ Production deployment
- ✅ Health monitoring

## 📄 License

MIT License - feel free to use this as a starting point for your own CRM or business application!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

**Built with ❤️ using modern web technologies**