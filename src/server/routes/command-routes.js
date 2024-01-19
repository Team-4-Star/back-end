// Imports our database pool object
import database_pool from "../../database/database.js"

// Imports our utility routes
import { sendUnauthorized, sendForbidden, sendBadRequest, sendInternalServerError } from "./utility-routes.js"

// Whenever this route is called, create a new command
const createCommand = async (req, res) => {

    // Verifies a user is logged in
    if (!req.session.user_id) {
        sendUnauthorized(req, res, "You must be logged in.")
        return
    }

    // Verifies the user is an admin
    let query_parameters = [req.session.user_id]
    let database_response = await database_pool.query("SELECT * FROM users WHERE id = $1 AND role = 'admin' LIMIT 1;", query_parameters)
    if (database_response.rowCount === 0) {
        sendForbidden(req, res, "Insufficient permissions.")
        return
    }

    // Verifies a command was passed
    if (req.body.command === undefined) {
        sendBadRequest(req, res, "No command provided.")
        return
    }

    // Verifies a description was passed
    if (req.body.description === undefined) {
        sendBadRequest(req, res, "No description provided.")
        return
    }

    // Creates the command
    query_parameters = [req.body.command, req.body.description]
    database_response = await database_pool.query("INSERT INTO commands (command, description) VALUES ($1, $2) RETURNING *;", query_parameters)

    // Verifies the command was created
    if (database_response.rowCount === 0) {
        sendInternalServerError(req, res, "Unable to create command.")
        return
    } else {
        res.send("Command sucessfully created.")
    }

}

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

    // Whenever this route is called, create a new command
    server.post("/commands", createCommand)

    // Whenever this route is called, return all the commands
    server.get("/commands", readAllCommands)

}

export default addCommandRoutes