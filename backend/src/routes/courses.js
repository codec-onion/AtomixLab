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
  body('thematique')
    .notEmpty()
    .withMessage('La thématique est requise')
    .isMongoId()
    .withMessage('La thématique doit être un ID valide'),
  body('niveauScolaire')
    .notEmpty()
    .withMessage('Le niveau scolaire est requis')
    .isMongoId()
    .withMessage('Le niveau scolaire doit être un ID valide'),
  body('session')
    .notEmpty()
    .withMessage('La session est requise')
    .isMongoId()
    .withMessage('La session doit être un ID valide'),
  body('type')
    .isIn(['Chimie', 'Physique', 'Rappel de connaissance'])
    .withMessage('Le type doit être "Chimie" ou "Physique" ou "Rappel de connaissance"'),
  body('urlDownload').trim().notEmpty().withMessage('L\'url de téléchargement est requise'),
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
