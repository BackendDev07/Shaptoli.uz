import { config } from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
import router from './routes'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = process.env.PORT || 3000

app.use('/api/v1', router)

app.listen(PORT, () =>
  console.log(`Server is running. host:http://localhost:${PORT}`)
)

// MVC = Model View Controller