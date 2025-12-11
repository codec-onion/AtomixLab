import Course from '../models/Course.js'
import Session from '../models/Session.js'
import NiveauScolaire from '../models/NiveauScolaire.js'
import Thematique from '../models/Thematique.js'

/**
 * Obtenir les cours dépendants d'une ressource
 * GET /api/reassignment/:resourceType/:id/dependencies
 */
export const getDependentCourses = async (req, res) => {
  try {
    const { resourceType, id } = req.params

    // Valider le type de ressource
    if (!['session', 'niveauScolaire', 'thematique'].includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: 'Type de ressource invalide'
      })
    }

    // Récupérer les cours qui utilisent cette ressource
    const query = {}
    query[resourceType] = id

    const courses = await Course.find(query)
      .select('_id title type')
      .lean()

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des dépendances:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    })
  }
}

/**
 * Réassigner les cours et supprimer l'ancienne ressource
 * POST /api/reassignment/:resourceType/:oldId/reassign
 * Body: { newId: string }
 */
export const reassignAndDelete = async (req, res) => {
  try {
    const { resourceType, oldId } = req.params
    const { newId } = req.body

    // Valider les paramètres
    if (!['session', 'niveauScolaire', 'thematique'].includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: 'Type de ressource invalide'
      })
    }

    if (!newId) {
      return res.status(400).json({
        success: false,
        message: 'newId est requis'
      })
    }

    if (oldId === newId) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de réassigner vers la même valeur'
      })
    }

    // Vérifier que la nouvelle ressource existe
    let newResource
    switch (resourceType) {
      case 'session':
        newResource = await Session.findById(newId)
        break
      case 'niveauScolaire':
        newResource = await NiveauScolaire.findById(newId)
        break
      case 'thematique':
        newResource = await Thematique.findById(newId)
        break
    }

    if (!newResource) {
      return res.status(404).json({
        success: false,
        message: 'Nouvelle ressource non trouvée'
      })
    }

    // Récupérer l'ancienne ressource pour le nom
    let oldResource
    switch (resourceType) {
      case 'session':
        oldResource = await Session.findById(oldId)
        break
      case 'niveauScolaire':
        oldResource = await NiveauScolaire.findById(oldId)
        break
      case 'thematique':
        oldResource = await Thematique.findById(oldId)
        break
    }

    if (!oldResource) {
      return res.status(404).json({
        success: false,
        message: 'Ancienne ressource non trouvée'
      })
    }

    // Récupérer les cours à réassigner
    const query = {}
    query[resourceType] = oldId
    const coursesToUpdate = await Course.find(query)

    // Préparer l'historique
    const updateHistory = {
      type: 'modification',
      userId: req.user._id,
      whatUpdated: resourceType,
      update: {
        from: oldResource.name,
        to: newResource.name
      }
    }

    // Mise à jour en masse avec historique
    const updateData = {}
    updateData[resourceType] = newId

    await Course.updateMany(
      query,
      {
        $set: updateData,
        $push: { updateCours: updateHistory }
      }
    )

    // Supprimer l'ancienne ressource
    await oldResource.deleteOne()

    res.status(200).json({
      success: true,
      message: `${coursesToUpdate.length} cours réassignés et ressource supprimée`,
      data: {
        reassignedCount: coursesToUpdate.length,
        deletedResource: {
          _id: oldResource._id,
          name: oldResource.name
        }
      }
    })
  } catch (error) {
    console.error('Erreur lors de la réassignation:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    })
  }
}
