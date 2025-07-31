import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const registerUser = async (req, res) => {
  const userData = req.body
  const { name, email, password, userType } = userData

  if ((!name || !email || !password || !userType)) {
    return res.status(400).json({
      success: false,
      message: 'please complete all the fields',
    })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  try {
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType,
    })
    await newUser.save()
    return res.status(201).json({
      success: true,
      message: `new ${userType} has registered`,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'server error' })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and password required' })
  }
try {
  const user = await User.findOne({ email })
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid credentials' })
  }

  // ✅ Create JWT
  const token = jwt.sign(
    { id: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  return res.status(200).json({
    success: true,
    message: `${user.userType} logged in successfully`,
    token,
    user: {
      id: user._id,
      username: user.name,
      email: user.email,
      userType: user.userType,
    },
  })
} catch (error) {
  console.error(error)
  return res.status(500).json({ success: false, message: 'Server error' })
}
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name userType _id')
    res.status(200).json({ success: true, users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
