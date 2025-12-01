import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Session from './models/Session.js'
import NiveauScolaire from './models/NiveauScolaire.js'
import Thematique from './models/Thematique.js'

dotenv.config()

// Script de migration pour transformer les champs String en références ObjectId
const migrate = async () => {
  try {
    console.log('🔄 Démarrage de la migration...')

    // Connexion à la base de données
    await connectDB()

    // Étape 1 : Extraire les valeurs uniques des cours existants (en utilisant MongoDB natif)
    console.log('\n📊 Étape 1/4 : Extraction des valeurs uniques...')

    const coursesCollection = mongoose.connection.collection('courses')
    const courses = await coursesCollection.find({}).toArray()

    if (courses.length === 0) {
      console.log('⚠️  Aucun cours trouvé dans la base de données.')
      console.log('✅ Migration terminée (rien à migrer).')
      process.exit(0)
    }

    console.log(`   Trouvé ${courses.length} cours à migrer`)

    // Extraire les valeurs uniques pour chaque collection
    const uniqueSessions = [...new Set(courses.map((c) => c.session).filter(Boolean))]
    const uniqueNiveauxScolaires = [...new Set(courses.map((c) => c.niveauScolaire).filter(Boolean))]
    const uniqueThematiques = [...new Set(courses.map((c) => c.thematique).filter(Boolean))]

    console.log(`   - Sessions uniques: ${uniqueSessions.length}`)
    console.log(`   - Niveaux scolaires uniques: ${uniqueNiveauxScolaires.length}`)
    console.log(`   - Thématiques uniques: ${uniqueThematiques.length}`)

    // Étape 2 : Créer les documents dans les nouvelles collections
    console.log('\n📝 Étape 2/4 : Création des nouvelles collections...')

    // Créer les sessions
    const sessionMap = {}
    for (const sessionName of uniqueSessions) {
      const existingSession = await Session.findOne({ name: sessionName })
      if (existingSession) {
        sessionMap[sessionName] = existingSession._id
        console.log(`   ✓ Session "${sessionName}" existe déjà`)
      } else {
        const session = await Session.create({ name: sessionName })
        sessionMap[sessionName] = session._id
        console.log(`   + Session "${sessionName}" créée`)
      }
    }

    // Créer les niveaux scolaires
    const niveauScolaireMap = {}
    for (const niveauName of uniqueNiveauxScolaires) {
      const existingNiveau = await NiveauScolaire.findOne({ name: niveauName })
      if (existingNiveau) {
        niveauScolaireMap[niveauName] = existingNiveau._id
        console.log(`   ✓ Niveau scolaire "${niveauName}" existe déjà`)
      } else {
        const niveau = await NiveauScolaire.create({ name: niveauName })
        niveauScolaireMap[niveauName] = niveau._id
        console.log(`   + Niveau scolaire "${niveauName}" créé`)
      }
    }

    // Créer les thématiques
    const thematiqueMap = {}
    for (const thematiqueName of uniqueThematiques) {
      const existingThematique = await Thematique.findOne({ name: thematiqueName })
      if (existingThematique) {
        thematiqueMap[thematiqueName] = existingThematique._id
        console.log(`   ✓ Thématique "${thematiqueName}" existe déjà`)
      } else {
        const thematique = await Thematique.create({ name: thematiqueName })
        thematiqueMap[thematiqueName] = thematique._id
        console.log(`   + Thématique "${thematiqueName}" créée`)
      }
    }

    // Étape 3 : Mettre à jour les cours avec les références ObjectId
    console.log('\n🔄 Étape 3/4 : Mise à jour des cours...')

    let updatedCount = 0
    let skippedCount = 0

    for (const course of courses) {
      try {
        // Vérifier si le cours a déjà été migré (les champs sont déjà des ObjectId)
        if (
          course.session instanceof mongoose.Types.ObjectId &&
          course.niveauScolaire instanceof mongoose.Types.ObjectId &&
          course.thematique instanceof mongoose.Types.ObjectId
        ) {
          skippedCount++
          continue
        }

        // Préparer les nouveaux ObjectId
        const updates = {}

        if (typeof course.session === 'string' && sessionMap[course.session]) {
          updates.session = sessionMap[course.session]
        }

        if (typeof course.niveauScolaire === 'string' && niveauScolaireMap[course.niveauScolaire]) {
          updates.niveauScolaire = niveauScolaireMap[course.niveauScolaire]
        }

        if (typeof course.thematique === 'string' && thematiqueMap[course.thematique]) {
          updates.thematique = thematiqueMap[course.thematique]
        }

        // Mettre à jour le cours si nécessaire
        if (Object.keys(updates).length > 0) {
          await coursesCollection.updateOne({ _id: course._id }, { $set: updates })
          updatedCount++
          console.log(`   ✓ Cours "${course.title}" mis à jour`)
        }
      } catch (error) {
        console.error(`   ✗ Erreur lors de la mise à jour du cours "${course.title}":`, error.message)
      }
    }

    console.log(`\n   ${updatedCount} cours mis à jour`)
    console.log(`   ${skippedCount} cours déjà migrés`)

    // Étape 4 : Vérification
    console.log('\n✅ Étape 4/4 : Vérification...')

    const sessionsCount = await Session.countDocuments()
    const niveauxScolairesCount = await NiveauScolaire.countDocuments()
    const thematiquesCount = await Thematique.countDocuments()

    console.log(`   - ${sessionsCount} sessions dans la base`)
    console.log(`   - ${niveauxScolairesCount} niveaux scolaires dans la base`)
    console.log(`   - ${thematiquesCount} thématiques dans la base`)

    console.log('\n🎉 Migration terminée avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 Connexion à la base de données fermée')
    process.exit(0)
  }
}

// Exécuter la migration
migrate()
