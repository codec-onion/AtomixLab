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
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
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
