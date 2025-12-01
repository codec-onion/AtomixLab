import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la session est requis'],
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

const Session = mongoose.model('Session', sessionSchema)

export default Session
