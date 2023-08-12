const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')

// @desc pega as notas para o ticket atual
// @route GET /api/tickets/:ticketId/notes
// @access Private
const getNotes = asyncHandler(async (req, res) => {

  const user = req.user

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.ticketId)

  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Unauthorized')
  }

  const notes = await Note.find({ ticket: req.params.ticketId })

  res.status(200).json(notes)
})

// @desc cria uma notas para o ticket atual
// @route POST /api/tickets/:ticketId/notes
// @access Private
const createNote = asyncHandler(async (req, res) => {

  const user = req.user

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: false,
    user: req.user.id,
    ticket: req.params.ticketId
  })

  console.log('teste christopher', note);

  res.status(200).json(note)
})

module.exports = {
  getNotes, createNote
}