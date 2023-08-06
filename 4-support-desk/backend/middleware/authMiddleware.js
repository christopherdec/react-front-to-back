const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {

  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401)
    throw new Error('Unauthorized')
  }

  try {
    const token = authorization.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // injeta o usuário na requisição, omitindo a senha
    req.user = await User.findById(decoded.id).select('-password')

    next()

  } catch (error) {
    console.log(error)
    res.status(401)
    throw new Error('Unauthorized')
  }

})

module.exports = { protect }
