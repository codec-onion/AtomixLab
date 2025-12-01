// A supprimer todo

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Course from './models/Course.js'
import User from './models/User.js'
import Session from './models/Session.js'
import NiveauScolaire from './models/NiveauScolaire.js'
import Thematique from './models/Thematique.js'
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
    await Session.deleteMany()
    await NiveauScolaire.deleteMany()
    await Thematique.deleteMany()

    console.log('👤 Création d\'un utilisateur admin...')
    const admin = await User.create({
      email: 'admin@atomixlab.com',
      password: 'admin123',
      role: 'admin',
    })

    console.log('✅ Admin créé: admin@atomixlab.com / admin123')

    // Étape 1 : Extraire les valeurs uniques
    console.log('📊 Extraction des valeurs uniques...')
    const uniqueSessions = [...new Set(coursesData.map((c) => c.session).filter(Boolean))]
    const uniqueNiveauxScolaires = [...new Set(coursesData.map((c) => c.niveauScolaire).filter(Boolean))]
    const uniqueThematiques = [...new Set(coursesData.map((c) => c.thematique).filter(Boolean))]

    console.log(`   - ${uniqueSessions.length} sessions uniques`)
    console.log(`   - ${uniqueNiveauxScolaires.length} niveaux scolaires uniques`)
    console.log(`   - ${uniqueThematiques.length} thématiques uniques`)

    // Étape 2 : Créer les nouvelles collections
    console.log('📝 Création des nouvelles collections...')

    // Créer les sessions
    const sessionMap = {}
    for (const sessionName of uniqueSessions) {
      const session = await Session.create({ name: sessionName })
      sessionMap[sessionName] = session._id
      console.log(`   + Session "${sessionName}" créée`)
    }

    // Créer les niveaux scolaires
    const niveauScolaireMap = {}
    for (const niveauName of uniqueNiveauxScolaires) {
      const niveau = await NiveauScolaire.create({ name: niveauName })
      niveauScolaireMap[niveauName] = niveau._id
      console.log(`   + Niveau scolaire "${niveauName}" créé`)
    }

    // Créer les thématiques
    const thematiqueMap = {}
    for (const thematiqueName of uniqueThematiques) {
      const thematique = await Thematique.create({ name: thematiqueName })
      thematiqueMap[thematiqueName] = thematique._id
      console.log(`   + Thématique "${thematiqueName}" créée`)
    }

    console.log('📚 Seed des cours...')

    // Transformer les données pour correspondre au schéma avec les références ObjectId
    const transformedCourses = coursesData.map((course) => ({
      title: course.title,
      thematique: thematiqueMap[course.thematique],
      niveauScolaire: niveauScolaireMap[course.niveauScolaire],
      session: sessionMap[course.session],
      type: course.type,
      urlDownload: course.urlDownload || 'https://example.com/course.pdf',
      description: course.description || '',
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
    await Session.deleteMany()
    await NiveauScolaire.deleteMany()
    await Thematique.deleteMany()
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
