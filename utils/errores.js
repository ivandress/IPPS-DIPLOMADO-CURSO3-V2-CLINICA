export const crearError = (status, mensaje) =>
  Object.assign(new Error(mensaje), { status })