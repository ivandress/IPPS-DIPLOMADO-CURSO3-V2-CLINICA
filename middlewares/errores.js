export const crearError = (status, mensaje) => {
    const error = new Error(mensaje)
    error.status = status
    return error
}

export const manejarErrores = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ error: `Id con formato inválido: ${err.value}` })
    }
    if (err.code === 11000) {
        const campo = Object.keys(err.keyValue || {})[0] || 'dato'
        return res.status(409).json({ error: `El ${campo} ya está registrado` })
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message })
    }

    console.error(err)
    return res.status(500).json({ error: 'Error interno del servidor' })
}