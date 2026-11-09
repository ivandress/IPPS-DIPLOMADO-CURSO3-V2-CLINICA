import { Paciente } from '../models/paciente.model.js'

export const crear = (datos = {}, medicoId) =>
    Paciente.create({...datos, medico: medicoId })

export const listarDe = (medicoId, prevision) => {
    const filtro = { medico: medicoId }
    if (prevision) filtro.prevision = prevision
    return Paciente.find(filtro)
}

export const buscarPorId = (id) => Paciente.findById(id)

export const actualizar = (paciente, datos = {}) => {
    const { medico, _id, ...cambios } = datos
    paciente.set(cambios)
    return paciente.save()
}

export const eliminar = (paciente) => paciente.deleteOne()