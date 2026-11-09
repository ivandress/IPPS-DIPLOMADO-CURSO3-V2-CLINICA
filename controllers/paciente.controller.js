import * as service from '../services/paciente.service.js'
import { crearError } from '../middlewares/errores.js'

const buscarOFallar = async(id) => {
    const paciente = await service.buscarPorId(id)
    if (!paciente) throw crearError(404, `No existe el paciente ${id}`)
    return paciente
}

const verificarTratante = (paciente, medicoId) => {
    if (paciente.medico.toString() !== medicoId) {
        throw crearError(403, 'Solo el médico tratante puede modificar o eliminar este paciente')
    }
}

export const crear = async(req, res) => {
    const paciente = await service.crear(req.body, req.medico.id)
    res.status(201).json(paciente)
}

export const listar = async(req, res) => {
    const pacientes = await service.listarDe(req.medico.id, req.query.prevision)
    res.json(pacientes)
}

export const obtener = async(req, res) => {
    const paciente = await buscarOFallar(req.params.id)
    res.json(paciente)
}

export const actualizar = async(req, res) => {
    const paciente = await buscarOFallar(req.params.id)
    verificarTratante(paciente, req.medico.id)
    const actualizado = await service.actualizar(paciente, req.body)
    res.json(actualizado)
}

export const eliminar = async(req, res) => {
    const paciente = await buscarOFallar(req.params.id)
    verificarTratante(paciente, req.medico.id)
    await service.eliminar(paciente)
    res.status(204).end()
}