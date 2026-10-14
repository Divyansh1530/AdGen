import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

//routes import

import authRoutes from './routes/auth.routes.ts'
import projectRoutes from './routes/project.routes.ts'

//routes declaration

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/projects",projectRoutes)

export default app