const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getNotes, createNote } = require('../controllers/noteController')

// mergeParams permite com que esse router seja filho do ticketRoutes
const router = express.Router({ mergeParams: true })

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote)

module.exports = router
