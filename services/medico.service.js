import { Medico } from '../models/medico.model.js'
import { Paciente } from '../models/paciente.model.js'
import { crearError } from '../utils/errores.js'

export const listar = (especialidad) =>
  Medico.find(especialidad ? { especialidad } : {})

export const buscarPorId = async (id) => {
  const medico = await Medico.findById(id)
  if (!medico) throw crearError(404, `No existe el médico ${id}`)
  return medico
}

export const pacientesDe = async (id) => {
  await buscarPorId(id)               // 404 si el médico no existe
  return Paciente.find({ medico: id }) // [] si no tiene pacientes
}