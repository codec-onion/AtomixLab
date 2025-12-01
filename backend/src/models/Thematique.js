import mongoose from 'mongoose'

const thematiqueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la thématique est requis'],
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

const Thematique = mongoose.model('Thematique', thematiqueSchema)

export default Thematique
