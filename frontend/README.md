# Dumb CRM Frontend

A modern React frontend for the Dumb CRM system built with Vite, React Router, and Tailwind CSS.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Full CRUD Operations**: Create, read, update, and delete for all entities
- **Real-time Search**: Search functionality across customers, contacts, and deals
- **Dashboard**: Overview with statistics and quick actions
- **Form Validation**: Client-side validation with react-hook-form
- **Toast Notifications**: User feedback with react-hot-toast
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form handling and validation
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications

## Project Structure

```
src/
├── api/                 # API client and endpoints
│   └── client.js       # Axios configuration and API methods
├── components/         # Reusable components
│   ├── Layout.jsx     # Main layout with navigation
│   ├── CustomerForm.jsx
│   ├── ContactForm.jsx
│   └── DealForm.jsx
├── pages/             # Page components
│   ├── Dashboard.jsx
│   ├── Customers.jsx
│   ├── CustomerDetail.jsx
│   ├── Contacts.jsx
│   ├── Deals.jsx
│   └── DealDetail.jsx
├── App.jsx            # Main app component with routing
├── main.jsx           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3001`

4. **Build for production**:
   ```bash
   npm run build
   ```

## API Integration

The frontend connects to the backend API through:

- **Proxy Configuration**: Vite dev server proxies API calls to the backend
- **Axios Client**: Configured with base URL and interceptors
- **Error Handling**: Consistent error handling and user feedback
- **Loading States**: Loading indicators for better UX

## Features Overview

### Dashboard
- Statistics cards showing totals for customers, contacts, deals, and won value
- Quick action buttons for common tasks
- Overview of business metrics

### Customers
- List all customers with search functionality
- Create, edit, and delete customers
- View customer details with associated contacts and deals
- Search by name, email, or company

### Contacts
- Manage customer contacts
- Link contacts to customers
- Search and filter contacts
- Full CRUD operations

### Deals
- Track sales deals with status (open, won, lost)
- Deal statistics and analytics
- Filter by status
- Link deals to customers
- Value tracking and reporting

## Development

- **Hot Reload**: Changes are reflected immediately during development
- **ESLint**: Code linting for consistency
- **Responsive**: Mobile-first design approach
- **Accessibility**: Semantic HTML and keyboard navigation support

## Deployment

The frontend can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure the API URL is correctly configured for production
