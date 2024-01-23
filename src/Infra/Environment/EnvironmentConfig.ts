import * as dotenv from 'dotenv'

dotenv.config()

export const {
    MONGO_DB_URL,
    MONGO_DATABASE,
    MONGO_TEST_DATABASE
} = process.env
