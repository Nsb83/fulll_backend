import mongoose from 'mongoose'

export class MongoDBConnection {
    private static instance: MongoDBConnection
    private readonly url: string

    private constructor(mongoUrl: string) {
        this.url = mongoUrl
    }

    public static getInstance(mongoUrl: string): MongoDBConnection {
        if (!MongoDBConnection.instance) {
            MongoDBConnection.instance = new MongoDBConnection(mongoUrl)
        }
        return MongoDBConnection.instance
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(this.url)
        } catch (error) {
            throw error
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect()
        } catch (error) {
            throw error
        }
    }
}

export async function connectToDb(mongoUrl: string) {
    const dbConnection = MongoDBConnection.getInstance(mongoUrl)
    try {
        await dbConnection.connect()
    } catch (error) {
        console.error('Error while connecting to MongoDB:', error)
        process.exit(1)
    }
}

export async function disconnectFromDb(mongoUrl: string) {
    const dbConnection = MongoDBConnection.getInstance(mongoUrl)
    try {
        await dbConnection.disconnect()
    } catch (error) {
        console.error('Error while connecting to MongoDB:', error)
    }
}
