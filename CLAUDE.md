# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AtomixLab is a monorepo project for archiving and consulting courses for a professor. It consists of:
- **Frontend**: Vue 3 + Vite SPA for displaying and filtering courses (deployed on Vercel)
- **Backend**: Express 5 + MongoDB API for course management (deployed on Render)

## Repository Structure

```
/
├── front/          → Vue 3 frontend application
├── backend/        → Express 5 + MongoDB API
└── README.md       → Project documentation
```

## Frontend (front/)

### Development Commands

```bash
cd front
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run format       # Format code with Prettier
```

### Tech Stack
- **Vue 3.5.22** with Composition API (`<script setup>`)
- **Vite 7** - Build tool and dev server
- **Pinia 3** - State management
- **Vue Router 4** - Routing
- **Axios** - HTTP client
- **FontAwesome 7** - Icons
- **Vue Select 4** - Enhanced select components

### Architecture

**Directory Structure:**
```
src/
├── _services/          → API calls and data fetching (axios instances)
├── assets/styles/      → Global CSS (variables, utilities, reset)
├── components/         → Reusable UI components
├── router/             → Vue Router configuration
├── stores/             → Pinia stores (state management)
├── views/              → Route-level components
├── App.vue             → Root component with layout (Header/Footer)
└── main.js             → App initialization
```

**Key Components:**
- `Header.vue` - Site header with physics/chemistry themed icons
- `Footer.vue` - Footer with copyright and legal text
- `ListeCours.vue` - Main container for course listing feature
- `HeaderListeCours.vue` - Filter controls (Session, Level, Theme dropdowns)
- `Cours.vue` - Individual course card component
- `Presentation.vue` - Welcome/presentation section

**State Management (Pinia):**
- **Main Store**: `useDonnesStore()` (stores/donnees.js)
  - State: `cours` (array), `sessionChoisie`, `isLoading`, `isLoaded`
  - Actions: `loadDatas()` - lazy loads course data on first mount
  - Computed: Dynamic filter options derived from course data

**Data Flow:**
1. Component mounts → `onMounted()` lifecycle hook
2. `ListeCours` calls `useDonnesStore().loadDatas()`
3. Store calls `getCours()` service
4. Service uses Axios to GET `/courses.json` (currently mock data in public/)
5. Data cached in store → components reactively update

**API Integration (Current):**
- Mock data served from `/public/*.json` files
- Base URL: `http://localhost:5173`
- Endpoints: `/courses.json`, `/sessions.json`
- Note: Authentication is commented out for future implementation

**Styling System:**
- CSS custom properties (variables) for design tokens in `assets/styles/variables.css`
- Utility classes in `assets/styles/utilitaire.css` (flexbox, margins, etc.)
- Component-scoped styles (no global pollution)
- Responsive: Separate desktop/mobile font sizes
- Color scheme: Light blue primary (#ECF8FF), dark blue secondary (#34549F)

**Current Features:**
- ✅ Course listing with card layout
- ✅ Filter dropdowns with dynamic options
- ✅ Session auto-detection (current academic year)
- ✅ FontAwesome icon integration for course types
- ✅ Hover animations on cards
- ⏳ Course click functionality (TODO)
- ⏳ Actual filtering logic (TODO)
- ⏳ Real backend integration (TODO)

### Development Notes

**Component Patterns:**
- Use Composition API with `<script setup>` syntax
- Props for parent-child communication
- `storeToRefs()` to maintain reactivity when destructuring stores
- Computed properties for derived state
- Services layer for API abstraction

**Styling Patterns:**
- Use CSS variables from `variables.css` for colors, fonts, spacing
- Scoped styles in components (`<style scoped>`)
- Utility classes for common layouts (`.flexbox_usual`, `.margin_section`)
- BEM-like naming for component-specific classes

**Code Quality:**
- Prettier configured (`.prettierrc.json`)
- Node version: ^20.19.0 || >=22.12.0

## Backend (backend/)

### Development Commands

```bash
cd backend
npm install                # Install dependencies
npm run dev               # Start dev server with auto-reload (http://localhost:3000)
npm start                 # Production server
npm run seed              # Populate database with mock data
npm run seed:delete       # Clear all data from database
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

### Tech Stack
- **Node.js/Express 5** - RESTful API server
- **MongoDB + Mongoose 8** - Database and ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing

### Architecture

**Directory Structure:**
```
src/
├── config/             → Database connection (db.js)
├── models/             → Mongoose schemas (User, Course)
├── controllers/        → Business logic (authController, courseController)
├── routes/             → Express routes (auth, courses)
├── middlewares/        → Custom middleware (auth, error handling)
├── server.js           → App entry point
└── seed.js             → Database seeding script
```

### API Endpoints

**Monitoring** (Public):
- `GET /health` - Health check endpoint with MongoDB connection test (returns status, database state, uptime)
- `GET /keep-alive` - Lightweight keep-alive endpoint for cron jobs (minimal logging, fast response)

**Authentication** (Public):
- `POST /api/auth/register` - User registration (returns JWT)
- `POST /api/auth/login` - User login (returns JWT)
- `GET /api/auth/me` - Get current user (protected)

**Courses**:
- `GET /api/courses` - List all courses with optional filters (session, niveauScolaire, thematique, type, search)
- `GET /api/courses/:id` - Get single course
- `GET /api/courses/sessions/list` - Get unique sessions list
- `POST /api/courses` - Create course (admin only, protected)
- `PUT /api/courses/:id` - Update course (admin only, protected)
- `DELETE /api/courses/:id` - Delete course (admin only, protected)

**Authentication Flow:**
1. User logs in → receives JWT token
2. Token stored in localStorage by frontend
3. Axios interceptor adds `Authorization: Bearer {token}` to all requests
4. Backend validates token via `protect` middleware
5. Admin-only routes use `restrictTo('admin')` middleware

**Data Models:**

**User Schema:**
- email (unique, required)
- password (hashed with bcrypt, min 6 chars)
- role (enum: 'user', 'admin')
- timestamps (createdAt, updatedAt)

**Course Schema:**
- title, thematiqueId, thematique
- niveauScolaireId, niveauScolaire
- sessionIds (array), session
- type (enum: 'Chimie', 'Physique')
- description (optional)
- creationDate (formatted string)
- updateCours (array of update history objects)
- timestamps

**Update History Schema** (embedded in Course):
- type (creation, modification, ajout, suppression)
- userId (ref to User)
- whatUpdated (field name)
- update: { from, to }

### Environment Variables

See `.env.example`:
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `FRONTEND_URL` - CORS allowed origin

### Development Notes

**Seeding Database:**
- Run `npm run seed` to populate with data from `front/public/cours.json`
- Creates admin user: `admin@atomixlab.com` / `admin123`
- Transforms mock data to match Mongoose schema

**Database Connection (config/db.js):**
- **Connection Options**:
  - `serverSelectionTimeoutMS: 5000` - Timeout for server selection
  - `socketTimeoutMS: 45000` - Timeout for socket operations
  - `maxPoolSize: 10` - Maximum connections in pool
  - `minPoolSize: 2` - Minimum connections to maintain (keeps DB connection alive)
- **Event Handlers**:
  - `disconnected` - Logs warning and triggers automatic reconnection
  - `reconnected` - Logs successful reconnection
  - `error` - Logs MongoDB errors for debugging
- **Automatic Reconnection**: Mongoose handles reconnection internally with the configured options

**Security:**
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens for stateless authentication
- Protected routes use `protect` middleware
- Role-based access control with `restrictTo(...roles)`
- CORS configured for frontend origin only

**Error Handling:**
- Global error handler middleware
- Mongoose validation errors formatted
- 404 handler for unknown routes
- JWT errors (invalid/expired) return 401

**Code Quality:**
- ESLint + Prettier configured (matches frontend)
- ES modules (`"type": "module"` in package.json)
- Express-validator for request validation
- Consistent error response format: `{ success, message, data }`

**High Availability & Monitoring:**
- **Keep-Alive Strategy**: `/keep-alive` endpoint pinged every 7 minutes by cron-job.org to prevent Render free tier from sleeping
- **MongoDB Connection Resilience**:
  - `serverSelectionTimeoutMS: 5000` - Quick server selection
  - `socketTimeoutMS: 45000` - Prevents premature socket timeouts
  - `maxPoolSize: 10` / `minPoolSize: 2` - Connection pooling to maintain active connections
  - Event listeners for `disconnected`, `reconnected`, `error` with automatic reconnection
- **Health Monitoring**: `/health` endpoint tests MongoDB connectivity and returns uptime metrics
- **Production Deployment**: Render (backend), Vercel (frontend), MongoDB Atlas (database)

### Integration with Frontend

**Updated Files:**
- `front/src/_services/axios.js` - baseURL changed to `http://localhost:3000/api`
- `front/src/_services/donnees.service.js` - Updated to use API endpoints instead of JSON files
- `front/src/_services/auth.service.js` - New file for authentication operations

**JWT Flow:**
- Token stored in localStorage on login
- Axios request interceptor adds token to headers
- Axios response interceptor handles 401 errors (redirects to /login)

## Git Workflow

**Main branch**: `main`

**Recent Activity** (based on commits):
- Course card implementation
- Header updates for course listing
- Session detection features

**Status**: Clean working directory (no uncommitted changes)

## Project Context

This is a course archiving and consultation platform for educational purposes. The frontend displays courses with filtering capabilities by session, academic level, and theme. Each course has associated metadata (type, level, session, theme, title).

**Key Business Logic:**
- **Sessions**: Academic year format (e.g., "2024-2025")
- **Levels**: Educational levels (e.g., "Seconde", "Première")
- **Themes**: Subject topics within physics/chemistry
- **Course Types**: Different formats with associated FontAwesome icons (documents, videos, exercises, etc.)