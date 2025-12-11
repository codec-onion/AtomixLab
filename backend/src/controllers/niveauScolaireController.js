import NiveauScolaire from '../models/NiveauScolaire.js'
import { validationResult } from 'express-validator'

// @desc    Get all niveaux scolaires
// @route   GET /api/niveaux-scolaires
// @access  Public
export const getNiveauxScolaires = async (req, res) => {
  try {
    const niveauxScolaires = await NiveauScolaire.find().sort({ name: 1 })

    res.status(200).json({
      success: true,
      count: niveauxScolaires.length,
      data: niveauxScolaires,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des niveaux scolaires:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des niveaux scolaires',
      error: error.message,
    })
  }
}

// @desc    Get single niveau scolaire by ID
// @route   GET /api/niveaux-scolaires/:id
// @access  Public
export const getNiveauScolaire = async (req, res) => {
  try {
    const niveauScolaire = await NiveauScolaire.findById(req.params.id)

    if (!niveauScolaire) {
      return res.status(404).json({
        success: false,
        message: 'Niveau scolaire non trouvé',
      })
    }

    res.status(200).json({
      success: true,
      data: niveauScolaire,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du niveau scolaire:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du niveau scolaire',
      error: error.message,
    })
  }
}

// @desc    Create a new niveau scolaire
// @route   POST /api/niveaux-scolaires
// @access  Private (Admin only)
export const createNiveauScolaire = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    // Vérifier si le niveau scolaire existe déjà
    const existingNiveauScolaire = await NiveauScolaire.findOne({
      name: req.body.name,
    })
    if (existingNiveauScolaire) {
      return res.status(400).json({
        success: false,
        message: 'Un niveau scolaire avec ce nom existe déjà',
      })
    }

    const niveauScolaire = await NiveauScolaire.create(req.body)

    res.status(201).json({
      success: true,
      data: niveauScolaire,
    })
  } catch (error) {
    console.error('Erreur lors de la création du niveau scolaire:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du niveau scolaire',
      error: error.message,
    })
  }
}

// @desc    Update a niveau scolaire
// @route   PUT /api/niveaux-scolaires/:id
// @access  Private (Admin only)
export const updateNiveauScolaire = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    let niveauScolaire = await NiveauScolaire.findById(req.params.id)

    if (!niveauScolaire) {
      return res.status(404).json({
        success: false,
        message: 'Niveau scolaire non trouvé',
      })
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour le niveau scolaire actuel)
    if (req.body.name) {
      const existingNiveauScolaire = await NiveauScolaire.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
      })
      if (existingNiveauScolaire) {
        return res.status(400).json({
          success: false,
          message: 'Un niveau scolaire avec ce nom existe déjà',
        })
      }
    }

    niveauScolaire = await NiveauScolaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(200).json({
      success: true,
      data: niveauScolaire,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du niveau scolaire:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du niveau scolaire',
      error: error.message,
    })
  }
}

// @desc    Delete a niveau scolaire
// @route   DELETE /api/niveaux-scolaires/:id
// @access  Private (Admin only)
export const deleteNiveauScolaire = async (req, res) => {
  try {
    const niveauScolaire = await NiveauScolaire.findById(req.params.id)

    if (!niveauScolaire) {
      return res.status(404).json({
        success: false,
        message: 'Niveau scolaire non trouvé',
      })
    }

    // Vérifier les dépendances avec les cours
    const Course = (await import('../models/Course.js')).default
    const dependentCourses = await Course.find({ niveauScolaire: req.params.id })
      .select('_id title type')
      .lean()

    if (dependentCourses.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Impossible de supprimer ce niveau scolaire car ${dependentCourses.length} cours y sont associés`,
        data: {
          dependentCourses,
          count: dependentCourses.length
        }
      })
    }

    await niveauScolaire.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Niveau scolaire supprimé avec succès',
      data: {},
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du niveau scolaire:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du niveau scolaire',
      error: error.message,
    })
  }
}
