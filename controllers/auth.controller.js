import * as service from '../services/auth.service.js'
import { crearError } from '../middlewares/errores.js'

export const registrar = async(req, res) => {
    const resultado = await service.registrar(req.body)
    res.status(201).json(resultado)
}

export const login = async(req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw crearError(400, 'Email y contraseña son obligatorios')
    }

    const resultado = await service.login(email.toLowerCase().trim(), password)

    if (!resultado) {
        throw crearError(401, 'Email o contraseña incorrectos')
    }

    res.json(resultado)
}