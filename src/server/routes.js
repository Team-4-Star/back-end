// Imports our database pool object
import database_pool from "../database/database.js"

// The crytpo module allows us to perform cryptographic functions
import bcrypt from "bcrypt"

// Whenever this route is called, return a session's CSRF token
const getCSRFToken = (req, res) => {
    res.json({ csrf_token: req.csrfToken() })
}

// Whenever this route is called, return whether a user is authenticated
const getAuthenticated = (req, res) => {
    res.json({ authenticated: req.session.authenticated === true })
}

// Whenever this route is called, create a new user
const registerUser = async (req, res) => {

    // Verifies the username was provided
    if (req.body.username === undefined) {
        sendBadRequest(req, res, "No username provided.")
        return
    }

    // Verifies the password was provided
    if (req.body.password === undefined) {
        sendBadRequest(req, res, "No password provided.")
        return
    }

    // Verifies the username passed does not already exists
    let query_options = [req.body.username]
    let database_response = await database_pool.query("SELECT username FROM users WHERE username = $1;", query_options)
    if (database_response.rowCount !== 0) {
        res.status(409)
        res.json({ message: `Username ${req.body.username} already exists.` })
        return
    }

    // Hashes the password
    const password_hash = bcrypt.hashSync(req.body.password, parseInt(process.env.salt_rounds))

    // Inserts the user data into the database'
    query_options = [req.body.username, password_hash]
    database_response = await database_pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Unable to register account.")
        return
    }

    // Logs the new user in
    loginUser(req, res)
}

// Whenever this route is called, login a user
const loginUser = async (req, res) => {

    // Get's the user's id
    let query_options = [req.body.username]
    let database_response = await database_pool.query("SELECT id FROM users WHERE username = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Credentials are invalid.")
        return
    }
    const user_id = database_response.rows[0].id

    // Gets the password hash
    query_options = [user_id]
    database_response = await database_pool.query("SELECT password_hash FROM users WHERE id = $1;", query_options)
    const password_hash = database_response.rows[0].password_hash

    // Compares the passwords
    if (!bcrypt.compareSync(req.body.password, password_hash)) {
        sendBadRequest(req, res, "Credentials are invalid." + "     " + req.body.password + "     " + password_hash)
        return
    }

    // Regenerates the session
    req.session.regenerate((err) => {

        // Sets session variables
        req.session.authenticated = true
        req.session.user_id = user_id

        // Sends success
        res.json({ message: "Success" })
    })
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

// Whenever this route is called, return all the flashcards
const readAllFlashcards = async (req, res) => {

    // Queries the database for all the flashcards
    const database_response = await database_pool.query("SELECT * FROM flashcards ORDER BY id;")

    // The pg module does not parse numerical values when returning a query response so this must be done manually
    for (const flashcard of database_response.rows) {
        flashcard.id = parseInt(flashcard.id)
        flashcard.category_id = parseInt(flashcard.category_id)
    }

    // Sends the commands
    res.send(database_response.rows)
}

// Whenever this route is called, return all the flashcard categories
const readAllFlashcardCategories = async (req, res) => {

    // Queries the database for all the flashcard categories
    const database_response = await database_pool.query("SELECT * FROM flashcard_categories ORDER BY id;")

    // The pg module does not parse numerical values when returning a query response so this must be done manually
    for (const category of database_response.rows) {
        category.id = parseInt(category.id)
    }

    // Sends the commands
    res.send(database_response.rows)
}

// This function is used to send a bad request response
const sendBadRequest = (req, res, err) => {
    res.status(400)
    res.json({ message: err })
}

// Applies routes to the server instance
export default (server) => {

    // Whenever this route is called, return a session's CSRF token
    server.get("/auth/token", getCSRFToken)

    // Whenever this route is called, return whether a user is authenticated
    server.get("/auth/authenticated", getAuthenticated)

    // Whenever this route is called, create a new user
    server.post("/auth/register", registerUser)

    // Whenever this route is called, login a user
    server.post("/auth/login", loginUser)

    // Whenever this route is called, return all the commands
    server.get("/api/commands", readAllCommands)

    // Whenever this route is called, return all the flashcards
    server.get("/api/flashcards", readAllFlashcards)

    // Whenever this route is called, return all the flashcard categories
    server.get("/api/flashcards/categories", readAllFlashcardCategories)
}