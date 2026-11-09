# API Clínica

API REST para una clínica, hecha con Node, Express y MongoDB. Permite registrar médicos, iniciar sesión con JWT y gestionar pacientes. Cualquier médico puede ver a un paciente, pero solo su médico tratante puede modificarlo o eliminarlo.

## Tecnologías

- Node.js y Express 5
- MongoDB con Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcryptjs para encriptar contraseñas

## Requisitos

- Node.js 20 o superior
- Yarn
- MongoDB local o una base de datos en MongoDB Atlas

## Cómo levantarlo

1. Instala las dependencias:

   ```bash
   yarn
   ```

2. Crea el archivo `.env` en la raíz copiando el ejemplo:

   ```bash
   copy .env.example .env
   ```

   Luego edítalo con la URL de tu base de datos:

   - **MongoDB Atlas:** reemplaza `USUARIO`, `CLAVE` y `TU-CLUSTER` con los datos de tu cluster.
   - **MongoDB local:** usa `MONGODB_URI=mongodb://127.0.0.1:27017/clinica`

3. Levanta el servidor:

   ```bash
   yarn dev
   ```

   En la terminal debe aparecer `Conectado a la BD` y `levantamos la api`.

La API queda en **http://localhost:3001**.

## Estructura del proyecto

```
config/        db.js · jwt.js
controllers/   auth · medico · paciente
middlewares/   proteger.js (verifica el token) · errores.js (traduce errores a su status)
models/        medico · paciente · ficha
routes/        auth · medico · paciente
services/      auth · medico · paciente
server.js
```

Cada petición sigue el camino **routes → controllers → services → models**.

## Rutas

| Método | Ruta | Token | Descripción |
|---|---|---|---|
| POST | `/auth/registro` | No | Registra un médico |
| POST | `/auth/login` | No | Inicia sesión y entrega un token |
| GET | `/medicos` | Sí | Lista médicos (filtro opcional `?especialidad=`) |
| GET | `/medicos/perfil` | Sí | Médico que hace la petición |
| GET | `/medicos/:id` | Sí | Un médico por id |
| GET | `/medicos/:id/pacientes` | Sí | Pacientes de un médico |
| POST | `/pacientes` | Sí | Crea un paciente del médico del token |
| GET | `/pacientes` | Sí | Mis pacientes (filtro opcional `?prevision=`) |
| GET | `/pacientes/:id` | Sí | Un paciente por id |
| PUT | `/pacientes/:id` | Sí | Actualiza (solo el médico tratante) |
| DELETE | `/pacientes/:id` | Sí | Elimina (solo el médico tratante) |

Las rutas con token requieren el header `Authorization: Bearer <token>`.

## Códigos de estado

| Status | Cuándo |
|---|---|
| 200 | Todo bien (también una lista vacía `[]`) |
| 201 | Se creó un médico o un paciente |
| 204 | Se eliminó un paciente (sin cuerpo) |
| 400 | Datos inválidos o id con formato incorrecto |
| 401 | Sin token, token inválido o login incorrecto |
| 403 | El paciente no pertenece al médico que hace la petición |
| 404 | El médico o el paciente no existe |
| 409 | Email o RUT ya registrado |

Los errores siempre se responden en JSON: `{ "error": "mensaje" }`.

## Pruebas realizadas

Probadas con Thunder Client.

### 1. Registro de médicos → 201

`POST /auth/registro`

```json
{
  "nombre": "Ana Pérez",
  "especialidad": "Pediatría",
  "email": "ana@clinica.cl",
  "password": "123456"
}
```

Responde `201` con `{ medico, token }`. El campo `password` no aparece en la respuesta. Se registró también a Juan Soto (Cardiología) para probar la regla del médico tratante.

### 2. Login → 200

`POST /auth/login`

```json
{ "email": "ana@clinica.cl", "password": "123456" }
```

Responde `200` con `{ medico, token }`. Con una contraseña incorrecta responde `401`.

### 3. Sin token → 401

`GET /pacientes` sin header de autorización.

```json
{ "error": "Falta el token" }
```

### 4. Crear paciente → 201

`POST /pacientes` con el token de Ana.

```json
{
  "nombre": "Pedro Pérez",
  "rut": "12.345.678-9",
  "fechaNacimiento": "1990-05-10",
  "prevision": "Isapre"
}
```

Responde `201`. El campo `medico` del paciente es el id de Ana, tomado del token y no del body.

### 5. Paciente por id → 200

`GET /pacientes/:id` con el token de Ana. Responde `200` con los datos del paciente.

### 6. Pacientes de un médico → 200

`GET /medicos/:id/pacientes` con el id de Ana. Responde `200` con la lista que incluye a Pedro.

### 7. Otro médico intenta editar → 403

`PUT /pacientes/:id` con el token de **Juan**.

```json
{ "telefono": "999999999" }
```

Respuesta:

```json
{ "error": "Solo el médico tratante puede modificar o eliminar este paciente" }
```

### 8. Faltan datos → 400

`POST /pacientes` sin body. Responde `400` indicando que faltan `nombre`, `rut` y `fechaNacimiento`.

### 9. RUT repetido → 409

`POST /pacientes` con el RUT `12.345.678-9` ya registrado.

```json
{ "error": "El rut ya está registrado" }
```

### 10. Eliminar paciente → 204

`DELETE /pacientes/:id` con el token de Ana. Responde `204` sin cuerpo. Al repetirlo responde `404`.

## Decisiones principales

- **Relación paciente → médico:** el paciente guarda solo el `_id` de su médico tratante, con `ref: 'Medico'`.
- **El médico sale del token:** al crear, el campo `medico` se toma de `req.medico.id`; al editar, se ignora cualquier `medico` enviado en el body.
- **Regla del médico tratante:** antes de modificar o eliminar, el controller compara `paciente.medico.toString()` con el id del token; si no coinciden, responde `403` y el paciente queda intacto.
- **Errores en un solo lugar:** un middleware al final de `server.js` traduce los errores de Mongoose a su código (400, 409) y el servidor nunca se cae.
- **La contraseña nunca sale:** el `toJSON` del modelo Médico la elimina de todas las respuestas.