import express from 'express'
import { body } from 'express-validator'
import {
  getThematiques,
  getThematique,
  createThematique,
  updateThematique,
  deleteThematique,
} from '../controllers/thematiqueController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Validation rules pour la création/modification de thématique
const thematiqueValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la thématique est requis'),
]

// Routes publiques (lecture)
router.get('/', getThematiques)
router.get('/:id', getThematique)

// Routes protégées (écriture - admin seulement)
router.post(
  '/',
  protect,
  restrictTo('admin'),
  thematiqueValidation,
  createThematique
)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  thematiqueValidation,
  updateThematique
)
router.delete('/:id', protect, restrictTo('admin'), deleteThematique)

export default router
