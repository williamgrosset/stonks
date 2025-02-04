import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api', routes)

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
