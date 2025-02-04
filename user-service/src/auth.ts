import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET || 'supersecret'

const users: { id: number; username: string; password: string }[] = []

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ message: 'Missing fields' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({ id: users.length + 1, username, password: hashedPassword })

    res.status(201).json({ message: 'User registered' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body
    const user = users.find(u => u.username === username)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '1h'
    })

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
