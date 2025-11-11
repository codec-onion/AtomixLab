import Course from '../models/Course.js'
import { validationResult } from 'express-validator'

// @desc    Get all courses with optional filters
// @route   GET /api/courses
// @access  Public (ou Private selon vos besoins)
export const getCourses = async (req, res) => {
  try {
    const { session, niveauScolaire, thematique, type, search } = req.query

    // Construire le filtre dynamiquement
    const filter = {}

    if (session) filter.session = session
    if (niveauScolaire) filter.niveauScolaire = niveauScolaire
    if (thematique) filter.thematique = thematique
    if (type) filter.type = type

    // Recherche textuelle
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { thematique: { $regex: search, $options: 'i' } },
      ]
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des cours',
      error: error.message,
    })
  }
}

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé',
      })
    }

    res.status(200).json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du cours',
      error: error.message,
    })
  }
}

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
export const createCourse = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const courseData = {
      ...req.body,
      updateCours: [
        {
          type: 'creation',
          userId: req.user._id,
          whatUpdated: 'title',
          update: {
            from: null,
            to: req.body.title,
          },
        },
      ],
    }

    const course = await Course.create(courseData)

    res.status(201).json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du cours',
      error: error.message,
    })
  }
}

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
export const updateCourse = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    let course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé',
      })
    }

    // Créer l'historique de modification
    const updateHistory = {
      type: 'modification',
      userId: req.user._id,
      whatUpdated: Object.keys(req.body).join(', '),
      update: {
        from: course.title,
        to: req.body.title || course.title,
      },
    }

    // Mettre à jour le cours
    course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        $push: { updateCours: updateHistory },
      },
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(200).json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du cours',
      error: error.message,
    })
  }
}

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé',
      })
    }

    await course.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Cours supprimé avec succès',
      data: {},
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du cours',
      error: error.message,
    })
  }
}

// @desc    Get unique sessions list
// @route   GET /api/courses/sessions/list
// @access  Public
export const getSessions = async (req, res) => {
  try {
    const sessions = await Course.distinct('session')

    res.status(200).json({
      success: true,
      data: sessions.sort(),
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message,
    })
  }
}
