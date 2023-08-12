const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getTickets, getTicket, createTicket, deleteTicket, updateTicket } = require('../controllers/ticketController')

// alternativa que permite definir "router.get()" e "router.post()" em sequência
router.route('/')
  .get(protect, getTickets)
  .post(protect, createTicket)

router.route('/:id')
  .get(protect, getTicket)
  .delete(protect, deleteTicket)
  .put(protect, updateTicket)

const noteRouter = require('./noteRoutes')
router.use('/:ticketId/notes', noteRouter)

module.exports = router
