import { Medico } from '../models/medico.model.js'
import { Paciente } from '../models/paciente.model.js'

export const listar = (especialidad) => {
    const filtro = especialidad ? { especialidad } : {}
    return Medico.find(filtro)
}

export const buscarPorId = (id) => Medico.findById(id)

export const pacientesDe = (medicoId) => Paciente.find({ medico: medicoId })