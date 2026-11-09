import * as service from '../services/medico.service.js'
import { crearError } from '../middlewares/errores.js'

export const listar = async(req, res) => {
    const medicos = await service.listar(req.query.especialidad)
    res.json(medicos)
}

export const perfil = async(req, res) => {
    const medico = await service.buscarPorId(req.medico.id)
    if (!medico) throw crearError(404, 'El médico del token ya no existe')
    res.json(medico)
}

export const obtener = async(req, res) => {
    const medico = await service.buscarPorId(req.params.id)
    if (!medico) throw crearError(404, `No existe el médico ${req.params.id}`)
    res.json(medico)
}

export const pacientes = async(req, res) => {
    const medico = await service.buscarPorId(req.params.id)
    if (!medico) throw crearError(404, `No existe el médico ${req.params.id}`)

    const lista = await service.pacientesDe(req.params.id)
    res.json(lista)
}