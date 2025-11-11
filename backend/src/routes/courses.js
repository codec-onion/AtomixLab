import express from 'express'
import { body } from 'express-validator'
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getSessions,
} from '../controllers/courseController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Validation rules pour la création/modification de cours
const courseValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('thematiqueId').notEmpty().withMessage('La thématique ID est requise'),
  body('thematique').trim().notEmpty().withMessage('La thématique est requise'),
  body('niveauScolaireId').notEmpty().withMessage('Le niveau scolaire ID est requis'),
  body('niveauScolaire').trim().notEmpty().withMessage('Le niveau scolaire est requis'),
  body('session').trim().notEmpty().withMessage('La session est requise'),
  body('type')
    .isIn(['Chimie', 'Physique'])
    .withMessage('Le type doit être "Chimie" ou "Physique"'),
]

// Route pour les sessions (doit être avant /:id pour éviter les conflits)
router.get('/sessions/list', getSessions)

// Routes publiques (lecture)
router.get('/', getCourses)
router.get('/:id', getCourse)

// Routes protégées (écriture - admin seulement)
router.post('/', protect, restrictTo('admin'), courseValidation, createCourse)
router.put('/:id', protect, restrictTo('admin'), courseValidation, updateCourse)
router.delete('/:id', protect, restrictTo('admin'), deleteCourse)

export default router
