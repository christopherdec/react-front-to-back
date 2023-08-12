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

const createNote = async (noteText, ticketId, token) => {

  const response = await axios.post(`${API_URL}/${ticketId}/notes`, {
    text: noteText
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const noteService = { getNotes, createNote }

export default noteService