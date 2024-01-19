// Imports our database pool object
import database_pool from "../../database/database.js"

// Whenever this route is called, return all the commands
const readAllCommands = async (req, res) => {

    // Queries the database for all the commands
    const database_response = await database_pool.query("SELECT * FROM commands ORDER BY id;")

    // The pg module does not parse numerical values when returning a query response so this must be done manually
    for (const command of database_response.rows) {
        command.id = parseInt(command.id)
    }

    // Sends the commands
    res.send(database_response.rows)
}

// Exports a function to add all the routes
const addCommandRoutes = (server) => {

    // Whenever this route is called, return all the commands
    server.get("/commands", readAllCommands)

}

export default addCommandRoutes