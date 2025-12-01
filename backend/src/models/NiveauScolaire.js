import mongoose from 'mongoose'

const niveauScolaireSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du niveau scolaire est requis'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const NiveauScolaire = mongoose.model('NiveauScolaire', niveauScolaireSchema)

export default NiveauScolaire
