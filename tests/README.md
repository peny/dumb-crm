# Tests

This directory contains tests for the Dumb CRM application.

## Backend Tests

Run backend tests with:
```bash
npm test
```

### Test Files:
- `auth.test.js` - Authentication endpoint tests
- `api.test.js` - General API endpoint tests

### Coverage:
```bash
npm run test:coverage
```

## Frontend Tests

Run frontend tests with:
```bash
cd frontend
npm test
```

### Test Files:
- `Login.test.jsx` - Login component tests
- `App.test.jsx` - Main app component tests
- `ProtectedRoute.test.jsx` - Route protection tests

### Coverage:
```bash
npm run test:coverage
```

## Test Coverage Goals

- Backend: >80% coverage
- Frontend: >70% coverage
- Critical paths: 100% coverage (auth, routing)

## Running Tests in CI/CD

Tests run automatically on:
- Pull requests
- Main branch pushes
- Deployment builds
