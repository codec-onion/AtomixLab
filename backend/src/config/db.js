import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Options pour maintenir la connexion active
      serverSelectionTimeoutMS: 5000, // Timeout pour sélectionner un serveur
      socketTimeoutMS: 45000, // Timeout pour les opérations socket
      maxPoolSize: 10, // Nombre max de connexions dans le pool
      minPoolSize: 2, // Nombre min de connexions à maintenir
    })

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`)

    // Gérer les événements de déconnexion
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB déconnecté! Tentative de reconnexion...')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnecté avec succès')
    })

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erreur MongoDB: ${err.message}`)
    })
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
