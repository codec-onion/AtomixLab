import express from 'express'
import { body } from 'express-validator'
import { register, login, getMe } from '../controllers/authController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
]

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
]

// Routes publiques
router.post('/register', registerValidation, protect, restrictTo("admin"), register)
router.post('/login', loginValidation, login)

// Routes protégées
router.get('/me', protect, getMe)

export default router
