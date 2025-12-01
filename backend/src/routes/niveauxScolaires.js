import express from 'express'
import { body } from 'express-validator'
import {
  getNiveauxScolaires,
  getNiveauScolaire,
  createNiveauScolaire,
  updateNiveauScolaire,
  deleteNiveauScolaire,
} from '../controllers/niveauScolaireController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Validation rules pour la création/modification de niveau scolaire
const niveauScolaireValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom du niveau scolaire est requis'),
]

// Routes publiques (lecture)
router.get('/', getNiveauxScolaires)
router.get('/:id', getNiveauScolaire)

// Routes protégées (écriture - admin seulement)
router.post(
  '/',
  protect,
  restrictTo('admin'),
  niveauScolaireValidation,
  createNiveauScolaire
)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  niveauScolaireValidation,
  updateNiveauScolaire
)
router.delete('/:id', protect, restrictTo('admin'), deleteNiveauScolaire)

export default router
