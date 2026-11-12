import * as service from '../services/paciente.service.js'

export const crear = async (req, res) => {
  const paciente = await service.crear(req.body ?? {}, req.medico.id)
  res.status(201).json(paciente)
}

export const listar = async (req, res) =>
  res.json(await service.listarMios(req.medico.id, req.query.prevision))

export const obtener = async (req, res) =>
  res.json(await service.buscarPorId(req.params.id))

export const actualizar = async (req, res) =>
  res.json(await service.actualizar(req.params.id, req.body ?? {}, req.medico.id))

export const eliminar = async (req, res) => {
  await service.eliminar(req.params.id, req.medico.id)
  res.status(204).send()
}