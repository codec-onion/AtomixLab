import mongoose from 'mongoose'

const updateHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    whatUpdated: {
      type: String,
      required: true,
    },
    update: {
      from: mongoose.Schema.Types.Mixed,
      to: mongoose.Schema.Types.Mixed,
    },
  },
  { _id: false, timestamps: true }
)

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    thematique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thematique',
      required: [true, 'La thématique est requise'],
    },
    niveauScolaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NiveauScolaire',
      required: [true, 'Le niveau scolaire est requis'],
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'La session est requise'],
    },
    type: {
      type: String,
      required: [true, 'Le type est requis'],
    },
    description: {
      type: String,
      default: '',
    },
    urlDownload: {
      type: String,
      required: [true, 'L\'url de téléchargement est requise']
    },
    creationDate: {
      type: String,
      default: function () {
        const now = new Date()
        const day = String(now.getDate()).padStart(2, '0')
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const year = now.getFullYear()
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        return `${day}-${month}-${year} ${hours}:${minutes}`
      },
    },
    updateCours: [updateHistorySchema],
  },
  {
    timestamps: true,
  }
)

// Index pour améliorer les performances des recherches
courseSchema.index({ title: 'text' })
courseSchema.index({ session: 1, niveauScolaire: 1, type: 1 })

const Course = mongoose.model('Course', courseSchema)

export default Course
