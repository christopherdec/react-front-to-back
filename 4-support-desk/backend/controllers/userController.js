const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

// @desc registra um novo usuário
// @route /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  const userExists = await User.findOne({email})

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  console.log('salt:', salt);

  const user = await User.create({
    name,
    email,
    password: passwordHash
  })

  if (!user) {
    throw new Error('Failed to register new user')
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  })

})

// @desc login de usuário
// @route /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body

  const user = await User.findOne({email})

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  })

})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

// @desc pega informações sobre o usuário atual
// @route /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name
  }
  res.status(200).json(user)
})

module.exports = {
  registerUser,
  loginUser,
  getMe
}