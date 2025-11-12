import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'

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

// Keep-alive endpoint (optimized for cron jobs)
app.get('/keep-alive', async (req, res) => {
  try {
    // Ping rapide de la DB pour maintenir la connexion active
    await mongoose.connection.db.admin().ping()

    // Log minimal pour éviter de surcharger les logs
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔄 Keep-alive ping reçu à ${new Date().toISOString()}`)
    }

    res.status(200).json({ alive: true })
  } catch (error) {
    res.status(503).json({ alive: false, error: error.message })
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
    },
  })
})

// Routes API
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)

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
