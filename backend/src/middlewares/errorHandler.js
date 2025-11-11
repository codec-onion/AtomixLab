// Middleware pour gérer les erreurs 404
export const notFound = (req, res, next) => {
  const error = new Error(`Non trouvé - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Middleware global de gestion des erreurs
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Erreur Mongoose - Cast Error (mauvais ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404
    message = 'Ressource non trouvée'
  }

  // Erreur Mongoose - Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ')
  }

  // Erreur Mongoose - Duplicate Key
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyPattern)[0]
    message = `${field} existe déjà`
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Token invalide'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expiré'
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}
