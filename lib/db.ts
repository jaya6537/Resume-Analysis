import { neon } from "@neondatabase/serverless"

// Ensure DATABASE_URL is set in your environment variables
const sql = neon(process.env.DATABASE_URL!)

export { sql }
