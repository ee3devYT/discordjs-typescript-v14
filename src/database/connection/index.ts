import consola from 'consola'
import mongoose from 'mongoose'

export async function connectMongo(URI: string) {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(URI)

        consola.success('Connect to MongoDB')
    } catch (error) {
        console.error(error)
    }
}
