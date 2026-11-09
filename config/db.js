import mongoose from 'mongoose'

export const conectar = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Conectado a la BD')
    } catch (error) {
        console.error('Error al conectar a la BD:', error.message)
        process.exit(1)
    }
}