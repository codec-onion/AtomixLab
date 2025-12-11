import Thematique from '../models/Thematique.js'
import { validationResult } from 'express-validator'

// @desc    Get all thematiques
// @route   GET /api/thematiques
// @access  Public
export const getThematiques = async (req, res) => {
  try {
    const thematiques = await Thematique.find().sort({ name: 1 })

    res.status(200).json({
      success: true,
      count: thematiques.length,
      data: thematiques,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des thématiques:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des thématiques',
      error: error.message,
    })
  }
}

// @desc    Get single thematique by ID
// @route   GET /api/thematiques/:id
// @access  Public
export const getThematique = async (req, res) => {
  try {
    const thematique = await Thematique.findById(req.params.id)

    if (!thematique) {
      return res.status(404).json({
        success: false,
        message: 'Thématique non trouvée',
      })
    }

    res.status(200).json({
      success: true,
      data: thematique,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la thématique:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la thématique',
      error: error.message,
    })
  }
}

// @desc    Create a new thematique
// @route   POST /api/thematiques
// @access  Private (Admin only)
export const createThematique = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    // Vérifier si la thématique existe déjà
    const existingThematique = await Thematique.findOne({ name: req.body.name })
    if (existingThematique) {
      return res.status(400).json({
        success: false,
        message: 'Une thématique avec ce nom existe déjà',
      })
    }

    const thematique = await Thematique.create(req.body)

    res.status(201).json({
      success: true,
      data: thematique,
    })
  } catch (error) {
    console.error('Erreur lors de la création de la thématique:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la thématique',
      error: error.message,
    })
  }
}

// @desc    Update a thematique
// @route   PUT /api/thematiques/:id
// @access  Private (Admin only)
export const updateThematique = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    let thematique = await Thematique.findById(req.params.id)

    if (!thematique) {
      return res.status(404).json({
        success: false,
        message: 'Thématique non trouvée',
      })
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour la thématique actuelle)
    if (req.body.name) {
      const existingThematique = await Thematique.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
      })
      if (existingThematique) {
        return res.status(400).json({
          success: false,
          message: 'Une thématique avec ce nom existe déjà',
        })
      }
    }

    thematique = await Thematique.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: thematique,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la thématique:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la thématique',
      error: error.message,
    })
  }
}

// @desc    Delete a thematique
// @route   DELETE /api/thematiques/:id
// @access  Private (Admin only)
export const deleteThematique = async (req, res) => {
  try {
    const thematique = await Thematique.findById(req.params.id)

    if (!thematique) {
      return res.status(404).json({
        success: false,
        message: 'Thématique non trouvée',
      })
    }

    // Vérifier les dépendances avec les cours
    const Course = (await import('../models/Course.js')).default
    const dependentCourses = await Course.find({ thematique: req.params.id })
      .select('_id title type')
      .lean()

    if (dependentCourses.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Impossible de supprimer cette thématique car ${dependentCourses.length} cours y sont associés`,
        data: {
          dependentCourses,
          count: dependentCourses.length
        }
      })
    }

    await thematique.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Thématique supprimée avec succès',
      data: {},
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la thématique:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la thématique',
      error: error.message,
    })
  }
}
