import express from 'express'
import cors from 'cors'

import { conectar } from './config/db.js'

import { authRoutes } from './routes/auth.routes.js'
import { medicoRoutes } from './routes/medico.route.js'
import { pacienteRoutes } from './routes/paciente.route.js'
import { manejarErrores } from './middlewares/errores.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/medicos', medicoRoutes)
app.use('/pacientes', pacienteRoutes)

app.use((req, res) => {
    res.status(404).json({ error: `No existe la ruta ${req.method} ${req.originalUrl}` })
})

app.use(manejarErrores)

await conectar()

app.listen(3001, () => {
    console.log('levantamos la api')
})