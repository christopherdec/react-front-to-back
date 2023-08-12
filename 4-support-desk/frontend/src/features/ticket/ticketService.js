import axios from 'axios'

const API_URL = '/api/tickets'

const createTicket = async (ticketData, token) => {
  const response = await axios.post(API_URL, ticketData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const getTickets = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const ticketService = { createTicket, getTickets }

export default ticketService
