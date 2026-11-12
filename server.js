import express from 'express'
import cors from 'cors'

import { conectar } from './config/db.js'
 
import { authRoutes } from './routes/auth.routes.js'
import { pacienteRoutes } from './routes/paciente.route.js'
import { medicoRoutes } from './routes/medico.routes.js'

const app = express()


app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
//http://localhost:3001/auth/registrar/
//http://localhost:3001/auth/login/

app.use('/pacientes', pacienteRoutes)

app.use('/medicos', medicoRoutes)

app.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ error: err.message })
  if (err.name === 'ValidationError' || err.name === 'CastError')
    return res.status(400).json({ error: err.message })
  if (err.code === 11000)
    return res.status(409).json({ error: 'Email o RUT ya registrado' })
  console.error(err)
  res.status(500).json({ error: 'Error interno' })
})

await conectar()

app.listen(3001, ()=>{
    console.log('levantmos al apu')
})