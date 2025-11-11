import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware pour protéger les routes
export const protect = async (req, res, next) => {
  try {
    let token

    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant',
      })
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Récupérer l'utilisateur sans le password
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé',
        })
      }

      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token invalide',
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification du token',
    })
  }
}

// Middleware pour restreindre l'accès aux admins
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas la permission d'effectuer cette action",
      })
    }
    next()
  }
}

// Fonction pour générer un JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}
