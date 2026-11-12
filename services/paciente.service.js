import { Paciente } from '../models/paciente.model.js'
import { crearError } from '../utils/errores.js'

// 404 si no existe
const obtenerOFallar = async (id) => {
  const paciente = await Paciente.findById(id)
  if (!paciente) throw crearError(404, `No existe el paciente ${id}`)
  return paciente
}

const verificarTratante = (paciente, medicoId) => {
  if (paciente.medico.toString() !== medicoId)
    throw crearError(403, 'Este paciente no es tuyo')
}

export const crear = (datos, medicoId) =>
  Paciente.create({ ...datos, medico: medicoId }) 

export const listarMios = (medicoId, prevision) =>
  Paciente.find({ medico: medicoId, ...(prevision && { prevision }) })

export const buscarPorId = (id) => obtenerOFallar(id)

export const actualizar = async (id, datos, medicoId) => {
  const paciente = await obtenerOFallar(id)
  verificarTratante(paciente, medicoId)

  const { medico, ...cambios } = datos
  return Paciente.findByIdAndUpdate(id, cambios, {
    new: true,
    runValidators: true,
  })
}

export const eliminar = async (id, medicoId) => {
  const paciente = await obtenerOFallar(id)
  verificarTratante(paciente, medicoId)
  await paciente.deleteOne()
}