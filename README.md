# Wazz - Real-time Messaging App

A real-time messaging application built with React, TypeScript, Node.js, GraphQL, and PostgreSQL.

## Features

- **User Authentication**: Simple username/password login system
- **Real-time Messaging**: Messages appear instantly without page refresh
- **Thread Management**: Create new conversations with other users
- **Thread List**: View all active conversations with latest message preview
- **Responsive Design**: Clean, modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation across frontend and backend

## Tech Stack

### Frontend
- **React** with TypeScript
- **Apollo Client** for GraphQL integration
- **Tailwind CSS** for styling
- **Vite** for development and building

### Backend
- **Node.js** with TypeScript
- **Apollo Server 4** for GraphQL API
- **Prisma** as ORM
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing

## Database Schema

The application uses a PostgreSQL database with the following entities and relationships:

### Database Diagram

![Database Schema](db-diagram.png)

## Prerequisites

Before running the application, make sure you have:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** database running locally
3. **npm** or **yarn** package manager

## Setup Instructions

### 1. Database Setup

First, set up a PostgreSQL database:

```bash
# Create a new database (using psql)
createdb wazz_app

# Or using PostgreSQL command line
psql -U postgres
CREATE DATABASE wazz_app;
\\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Update environment variables
# Edit the .env file with your database credentials
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/wazz_app"
JWT_SECRET="your-secret-key-here"
PORT=4000

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with test users
npm run seed

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:4000/graphql`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

## Test Users

The application comes with pre-seeded test users:

- **Username**: `alice` | **Password**: `password123`
- **Username**: `bob` | **Password**: `password123`
- **Username**: `charlie` | **Password**: `password123`
- **Username**: `diana` | **Password**: `password123`

## Usage

1. **Login**: Use any of the test user credentials to log in
2. **Start a Conversation**: Click "New Chat" and enter another user's username
3. **Send Messages**: Type in the message box and press Enter or click Send
4. **Real-time Updates**: Messages appear automatically without refreshing
5. **Switch Conversations**: Click on any conversation in the left sidebar

## GraphQL API

The backend exposes a GraphQL API with the following operations:

### Queries
- `me`: Get current user information
- `threads`: Get all user's conversation threads
- `thread(id)`: Get specific thread with messages
- `messages(threadId)`: Get all messages in a thread

### Mutations
- `login(username, password)`: Authenticate user
- `createThread(participantUsername)`: Start new conversation
- `sendMessage(threadId, content)`: Send a message

### Subscriptions
- `messageAdded(threadId)`: Real-time message updates
- `threadUpdated`: Real-time thread updates

## Development Scripts

### Backend
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run seed`: Seed database with test users
- `npm run db:migrate`: Run database migrations
- `npm run db:generate`: Generate Prisma client
- `npm run db:reset`: Reset database and run migrations

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Project Structure

```
wazz-app/
├── backend/
│   ├── src/
│   │   ├── resolvers/          # GraphQL resolvers
│   │   ├── types/              # GraphQL schema
│   │   ├── utils/              # Auth, database utilities
│   │   └── index.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Database seeding
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── apollo/             # Apollo Client setup
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx             # Main app component
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@localhost:5432/wazz_app"
JWT_SECRET="your-secret-key-here"
PORT=4000
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `psql -U username -d wazz_app`

### Port Conflicts
- Backend default: `4000`
- Frontend default: `5173`
- Change ports in respective package.json scripts if needed

### GraphQL Schema Issues
```bash
# Regenerate Prisma client
cd backend
npm run db:generate

# Reset database if needed
npm run db:reset
```

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend
1. Build the application: `npm run build`
2. Set environment variables for production
3. Run migrations: `npm run db:migrate`
4. Start server: `npm start`

### Frontend
1. Build the application: `npm run build`
2. Serve the `dist` folder using a web server
3. Update Apollo Client URI to point to production backend

## Current Development Status

**Current State**: MVP Development Version
- Basic authentication and messaging
- Real-time WebSocket communication
- PostgreSQL database with Prisma ORM
- GraphQL API with Apollo Server
- React frontend with TypeScript
- Infrastructure as Code (AWS CDK + CloudFormation)
- CI/CD pipelines with GitHub Actions


## Next Steps for Production

**Testing Strategy**:
- Unit Tests: Test individual functions and components
- Integration Tests: Test API endpoints and database interactions
- Security Testing: Penetration testing and vulnerability assessment

**Performance & Scalability**:
- Database Indexing: Add indexes for frequent queries
- Connection Pooling: Optimize Prisma connection pool settings
- Query Optimization: Analyze and optimize slow queries
- Auto Scaling: Implement horizontal scaling based on load

**Reliability & Monitoring**:
- Application Monitoring: Use tools like DataDog, CloudWatch, or New Relic
- Structured Logging: JSON-formatted logs with correlation IDs
- Performance Monitoring: Track response times, throughput
- Alerting: Set up alerts for critical issues

**Security Enhancements**:
- JWT Token Expiration: Implement refresh tokens and short-lived access tokens
- Role-Based Access Control: Admin, moderator, user roles
- Account Lockout: Implement brute force protection
- Rate Limiting: Implement per-user and global rate limits
- Input Sanitization: Sanitize all user inputs (XSS prevention)
- SQL Injection Prevention: Already handled by Prisma
- CSRF Protection: Cross-site request forgery protection
- Secrets Management: Use AWS Secrets Manager or similar
- Transport Security: Enforce HTTPS/WSS for all connections

**Frontend Improvements**:
- Responsive Design: Optimize for all device sizes

## License

Public license
