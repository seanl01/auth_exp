import postgres from "postgres";
import dotenv from 'dotenv';
dotenv.config();

const db = postgres(process.env.POSTGRES_URL)

export default db;