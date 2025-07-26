require("dotenv").config({ path: ".env.local" }) // Ensure dotenv is configured to load .env.local

const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function initDb() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set.")
    console.error("Please ensure it's defined in your .env.local file or environment.")
    process.exit(1)
  }

  const sql = neon(databaseUrl)

  try {
    const schemaPath = path.resolve(__dirname, "../db/schema.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Split the SQL commands by semicolon and filter out empty strings
    const commands = schemaSql
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0)

    console.log("Attempting to connect to database and execute schema...")

    for (const command of commands) {
      console.log(`Executing command: ${command.substring(0, 50)}...`) // Log first 50 chars
      await sql.query(command + ";") // Add semicolon back for execution
    }

    console.log("Database schema executed successfully. The 'resumes' table should now exist.")
  } catch (error) {
    console.error("Error initializing database:", error)
    console.error("Please check your DATABASE_URL and ensure your database is accessible.")
    process.exit(1)
  }
}

initDb()
