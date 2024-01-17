// The pg module allows us to interact with our PostgreSQL database
import pg from "pg"

// The dotenv module allows us to use enviroment variables stored in the .env file
import { config } from "dotenv"

// The process module allows us to interact with the OS process running this application
import { exit, env } from "process"

// Configures enviroment variables
config()

// Creates our database client from a connection string
const database_pool = new pg.Pool({
    connectionString: env.database_connection_string
})

// Attempts to connect to our PostgreSQL database
// On failure, exits the program
try {
    await database_pool.connect()
} catch (err) {
    console.log(err)
    exit(1)
}

// Exports our database client object
export default database_pool