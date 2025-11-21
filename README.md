# LifeBoard

A unified personal life dashboard where users can manage goals, finances, habits, tasks, health metrics, and bucket list items.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (bundler/dev server)
- Tailwind CSS
- React Router
- Axios
- Context API

**Backend:**
- Node.js + Express.js
- TypeScript
- JWT (Access & Refresh Tokens)
- bcrypt
- Zod (validation)
- Supabase (PostgreSQL)

**Deployment:**
- Frontend: Vercel
- Backend: Railway
- Database: Supabase

## Project Structure

```
LIFEBOARDER/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express API server
├── database/          # Database schema and seed data
└── README.md         # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account
- Git/GitHub account

### 1. Database Setup (Supabase)

1. **Create Supabase Project:**
   - Visit [supabase.com](https://supabase.com) and create a new project
   - Choose a database region closest to your users
   - Generate and store the database password

2. **Run Database Schema:**
   ```sql
   -- Copy and paste the contents of database/schema.sql in the Supabase SQL Editor
   -- This creates all tables, indexes, and RLS policies
   ```

3. **Seed Demo Data:**
   ```sql
   -- Copy and paste the contents of database/seed.sql in the Supabase SQL Editor
   -- This creates the demo account with sample data
   ```

4. **Get Database Credentials:**
   - Navigate to Settings > Database to get the connection string
   - Go to Settings > API to get the service role key (if needed)

### 2. Backend Setup

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables:**
   Create `.env` file:
   ```env
   PORT=5000
   DATABASE_URL=your-supabase-connection-string
   JWT_ACCESS_SECRET=your-256-bit-jwt-access-secret
   JWT_REFRESH_SECRET=your-256-bit-jwt-refresh-secret
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Backend will be available at http://localhost:5000

### 3. Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables:**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at http://localhost:5173

### 4. Demo Account

**Login Credentials:**
- Email: `demo@lifeboard.app`
- Password: `Demo1234!`

The demo account includes:
- 5 goals (active, in-progress, completed)
- 5 tasks (various priorities and statuses)
- 5 habits (daily and weekly)
- Sample financial entries
- Health metrics
- 8 bucket list items

## Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/change-password` - Change password

### Goals
- `GET /api/v1/goals` - Get user's goals
- `POST /api/v1/goals` - Create new goal
- `GET /api/v1/goals/:id` - Get specific goal
- `PUT /api/v1/goals/:id` - Update goal
- `DELETE /api/v1/goals/:id` - Delete goal
- `GET /api/v1/goals/stats` - Get goal statistics
- `PUT /api/v1/goals/:id/toggle` - Toggle goal status

### Health Check
- `GET /health` - API health status

## Deployment

### Backend Deployment (Railway)

1. **Connect GitHub Repository:**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Create new project from repository

2. **Configure Project:**
   - **Root Directory:** `backend/`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18.x

3. **Environment Variables:**
   Set these in Railway project settings:
   ```
   PORT=5000
   DATABASE_URL=your-supabase-connection-string
   JWT_ACCESS_SECRET=your-256-bit-jwt-access-secret
   JWT_REFRESH_SECRET=your-256-bit-jwt-refresh-secret
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

4. **Deploy:**
   - Push changes to GitHub
   - Railway will automatically build and deploy
   - Your API will be available at: `https://your-app-name.up.railway.app`

### Frontend Deployment (Vercel)

1. **Connect GitHub Repository:**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Import project with these settings:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend/`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

2. **Environment Variables:**
   Set this in Vercel project settings:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```

3. **Deploy:**
   - Push changes to GitHub
   - Vercel will automatically deploy
   - Your app will be available at: `https://your-app-name.vercel.app`

## Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **goals** - Personal goals with status tracking
- **tasks** - Daily tasks with priorities
- **habits** - Recurring habits with tracking
- **habit_entries** - Daily habit completion records
- **finances** - Income and expense tracking
- **health_metrics** - Health data tracking
- **bucket_items** - Life experiences list

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## Security Features

- JWT authentication with access/refresh tokens
- Password hashing with bcrypt (12 salt rounds)
- Input validation with Zod schemas
- CORS configuration for cross-origin requests
- SQL injection prevention with parameterized queries
- Row Level Security (RLS) on all database tables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.