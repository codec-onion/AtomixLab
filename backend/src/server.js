import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import sessionRoutes from './routes/sessions.js'
import niveauScolaireRoutes from './routes/niveauxScolaires.js'
import thematiqueRoutes from './routes/thematiques.js'
import reassignmentRoutes from './routes/reassignment.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'
import mongoose from 'mongoose'

// Charger les variables d'environnement
dotenv.config()

// Connexion à la base de données
connectDB()

// Initialiser Express
const app = express()

// Middleware pour parser le JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuration CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Configuration du logging HTTP avec Morgan
// Format personnalisé : méthode, URL, status, temps de réponse, User-Agent, IP
morgan.token('user-agent', (req) => req.get('User-Agent') || 'N/A')
morgan.token('real-ip', (req) =>
  req.headers['x-forwarded-for'] ||
  req.headers['x-real-ip'] ||
  req.socket.remoteAddress ||
  'N/A'
)

// Format différent selon l'environnement
if (process.env.NODE_ENV === 'production') {
  // Production : format compact avec User-Agent et IP
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms | UA: :user-agent | IP: :real-ip')
  )
} else {
  // Développement : format coloré avec plus de détails
  app.use(morgan('dev'))
  app.use(
    morgan(':method :url :status - :response-time ms | User-Agent: :user-agent | IP: :real-ip')
  )
}

// Health check endpoint (for monitoring services like Render)
app.get('/health', async (req, res) => {
  try {
    // Tester la connexion MongoDB
    await mongoose.connection.db.admin().ping()

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    })
  } catch (error) {
    console.error('❌ Health check failed:', error.message)
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    })
  }
})

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API AtomixLab 🧪⚛️',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)',
      },
      courses: {
        getAll: 'GET /api/courses',
        getOne: 'GET /api/courses/:id',
        create: 'POST /api/courses (admin)',
        update: 'PUT /api/courses/:id (admin)',
        delete: 'DELETE /api/courses/:id (admin)',
        sessions: 'GET /api/courses/sessions/list',
      },
      sessions: {
        getAll: 'GET /api/sessions',
        getOne: 'GET /api/sessions/:id',
        create: 'POST /api/sessions (admin)',
        update: 'PUT /api/sessions/:id (admin)',
        delete: 'DELETE /api/sessions/:id (admin)',
      },
      niveauxScolaires: {
        getAll: 'GET /api/niveaux-scolaires',
        getOne: 'GET /api/niveaux-scolaires/:id',
        create: 'POST /api/niveaux-scolaires (admin)',
        update: 'PUT /api/niveaux-scolaires/:id (admin)',
        delete: 'DELETE /api/niveaux-scolaires/:id (admin)',
      },
      thematiques: {
        getAll: 'GET /api/thematiques',
        getOne: 'GET /api/thematiques/:id',
        create: 'POST /api/thematiques (admin)',
        update: 'PUT /api/thematiques/:id (admin)',
        delete: 'DELETE /api/thematiques/:id (admin)',
      },
    },
  })
})

// Routes API
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/niveaux-scolaires', niveauScolaireRoutes)
app.use('/api/thematiques', thematiqueRoutes)
app.use('/api/reassignment', reassignmentRoutes)

// Middleware de gestion des erreurs (doit être après les routes)
app.use(notFound)
app.use(errorHandler)

// Démarrer le serveur
const PORT = process.env.PORT || 3000
const isProduction = process.env.NODE_ENV === 'production'

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
  console.log(`📍 Mode: ${process.env.NODE_ENV || 'development'}`)

  if (!isProduction) {
    console.log(`🌐 URL locale: http://localhost:${PORT}`)
  } else {
    console.log(`🌐 Serveur en production - Health check: /health`)
  }
})