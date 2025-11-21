// A supprimer3

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Course from './models/Course.js'
import User from './models/User.js'
import connectDB from './config/db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Configuration ES modules pour __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Charger les variables d'environnement
dotenv.config()

// Connexion à la base de données
connectDB()

// Charger les données mockées
const coursesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../front/public/cours.json'), 'utf-8')
)

// Fonction pour seed les données
const seedData = async () => {
  try {
    console.log('🗑️  Suppression des données existantes...')
    await Course.deleteMany()
    await User.deleteMany()

    console.log('👤 Création d\'un utilisateur admin...')
    const admin = await User.create({
      email: 'admin@atomixlab.com',
      password: 'admin123',
      role: 'admin',
    })

    console.log('✅ Admin créé: admin@atomixlab.com / admin123')

    console.log('📚 Seed des cours...')

    // Transformer les données pour correspondre au schéma
    const transformedCourses = coursesData.map((course) => ({
      title: course.title,
      thematiqueId: course.thematiqueId,
      thematique: course.thematique,
      niveauScolaireId: course.niveauScolaireId,
      niveauScolaire: course.niveauScolaire,
      sessionIds: course.sessionIds,
      session: course.session,
      type: course.type,
      creationDate: course.creationDate,
      updateCours: course.updateCours.map((update) => ({
        type: update.type,
        userId: admin._id, // Utiliser l'ID de l'admin créé
        whatUpdated: update.whatUpdated,
        update: update.update,
      })),
    }))

    await Course.insertMany(transformedCourses)

    console.log(`✅ ${transformedCourses.length} cours importés avec succès!`)
    console.log('🎉 Seed terminé avec succès!')
    console.log('---')
    console.log('Informations de connexion:')
    console.log('Email: admin@atomixlab.com')
    console.log('Password: admin123')
    console.log('---')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    process.exit(1)
  }
}

// Fonction pour supprimer toutes les données
const deleteData = async () => {
  try {
    console.log('🗑️  Suppression de toutes les données...')
    await Course.deleteMany()
    await User.deleteMany()
    console.log('✅ Données supprimées avec succès!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    process.exit(1)
  }
}

// Gérer les arguments de ligne de commande
if (process.argv[2] === '-d') {
  deleteData()
} else {
  seedData()
}
