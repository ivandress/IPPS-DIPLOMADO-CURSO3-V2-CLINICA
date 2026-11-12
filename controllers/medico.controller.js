import * as service from '../services/medico.service.js'

export const listar = async (req, res) =>
  res.json(await service.listar(req.query.especialidad))

export const perfil = async (req, res) =>
  res.json(await service.buscarPorId(req.medico.id))

export const obtener = async (req, res) =>
  res.json(await service.buscarPorId(req.params.id))

export const pacientes = async (req, res) =>
  res.json(await service.pacientesDe(req.params.id))