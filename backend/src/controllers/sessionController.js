import Session from '../models/Session.js'
import { validationResult } from 'express-validator'

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ name: -1 })

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des sessions',
      error: error.message,
    })
  }
}

// @desc    Get single session by ID
// @route   GET /api/sessions/:id
// @access  Public
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      })
    }

    res.status(200).json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la session',
      error: error.message,
    })
  }
}

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private (Admin only)
export const createSession = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    // Vérifier si la session existe déjà
    const existingSession = await Session.findOne({ name: req.body.name })
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Une session avec ce nom existe déjà',
      })
    }

    const session = await Session.create(req.body)

    res.status(201).json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la session',
      error: error.message,
    })
  }
}

// @desc    Update a session
// @route   PUT /api/sessions/:id
// @access  Private (Admin only)
export const updateSession = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    let session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      })
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour la session actuelle)
    if (req.body.name) {
      const existingSession = await Session.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id },
      })
      if (existingSession) {
        return res.status(400).json({
          success: false,
          message: 'Une session avec ce nom existe déjà',
        })
      }
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la session:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la session',
      error: error.message,
    })
  }
}

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Private (Admin only)
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      })
    }

    // Vérifier les dépendances avec les cours
    const Course = (await import('../models/Course.js')).default
    const dependentCourses = await Course.find({ session: req.params.id })
      .select('_id title type')
      .lean()

    if (dependentCourses.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Impossible de supprimer cette session car ${dependentCourses.length} cours y sont associés`,
        data: {
          dependentCourses,
          count: dependentCourses.length
        }
      })
    }

    await session.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Session supprimée avec succès',
      data: {},
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la session:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la session',
      error: error.message,
    })
  }
}
