import express from 'express'
import { body } from 'express-validator'
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
} from '../controllers/sessionController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Validation rules pour la création/modification de session
const sessionValidation = [
  body('name').trim().notEmpty().withMessage('Le nom de la session est requis'),
]

// Routes publiques (lecture)
router.get('/', getSessions)
router.get('/:id', getSession)

// Routes protégées (écriture - admin seulement)
router.post('/', protect, restrictTo('admin'), sessionValidation, createSession)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  sessionValidation,
  updateSession
)
router.delete('/:id', protect, restrictTo('admin'), deleteSession)

export default router
