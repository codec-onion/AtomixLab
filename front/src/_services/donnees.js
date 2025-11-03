import Axios from "./axios"

export const getSessions = () => {
  return Axios.get("/public/sessions.json")
}

export const getCours = async () => {
  const res = await Axios.get("/public/cours.json")
  return res.data
}