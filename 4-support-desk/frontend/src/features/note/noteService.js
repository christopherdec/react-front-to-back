import axios from 'axios'

const API_URL = '/api/tickets'

const getNotes = async (ticketId, token) => {
  const response = await axios.get(`${API_URL}/${ticketId}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const noteService = { getNotes }

export default noteService