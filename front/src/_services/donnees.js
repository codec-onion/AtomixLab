import Axios from "./axios"

export const getSessions = async () => {
  try {
    const res = await Axios.get("/sessions.json")
    throw new Error("erreur")
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const getCours = async () => {
  const res = await Axios.get("/cours.json")
  return res.data
}