const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')

// @desc pega os tickets do usuário atual
// @route GET /api/tickets
// @access Private
const getTickets = asyncHandler(async (req, res) => {

  const user = req.user

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const tickets = await Ticket.find({ user: user.id })

  res.status(200).json(tickets)
})

// @desc retorna um ticket
// @route GET /api/tickets/:id
// @access Private
const getTicket = asyncHandler(async (req, res) => {

  const user = req.user

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (ticket.user.toString() !== user.id) {
    res.status(401)
    throw new Error('Unauthorized')
  }

  res.status(200).json(ticket)
})

// @desc cria um novo ticket
// @route POST /api/tickets
// @access Private
const createTicket = asyncHandler(async (req, res) => {

  const { product, description } = req.body

  if (!product || !description) {
    res.status(400)
    throw new Error('Please add a product and description')
  }

  const user = req.user

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.create({
    product,
    description,
    user: user.id,
  })

  res.status(201).json(ticket)
})

// @desc retorna um ticket
// @route DELETE /api/tickets/:id
// @access Private
const deleteTicket = asyncHandler(async (req, res) => {

  const user = req.user

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (ticket.user.toString() !== user.id) {
    res.status(401)
    throw new Error('Unauthorized')
  }

  await Ticket.deleteOne(ticket)

  res.status(200).json({ success: true })
})

// @desc retorna um ticket
// @route PUT /api/tickets/:id
// @access Private
const updateTicket = asyncHandler(async (req, res) => {

  const user = req.user

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  let ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  if (ticket.user.toString() !== user.id) {
    res.status(401)
    throw new Error('Unauthorized')
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(ticket._id, req.body, { new: true })

  res.status(200).json(updatedTicket)
})

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket,
}