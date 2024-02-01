// Imports our database pool object
import database_pool from "../../database/database.js"

// The process module allows us to interact with the OS process running this application
import { env } from "process"

// Imports our utility routes
import { sendBadRequest } from "./utility-routes.js"

// The crytpo module allows us to perform cryptographic functions
import bcrypt from "bcrypt"

// Whenever this route is called, return a session's CSRF token
const getCSRFToken = (req, res) => {
    //res.json({ csrf_token: req.csrfToken() })
    res.json({ csrf_token: "" })
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
    } else if (typeof req.body.username !== "string") {
        sendBadRequest(res, `Property 'username' should be of type string, received ${typeof req.body.username} instead`)
        return
    }

    // Verifies the password was provided
    if (req.body.password === undefined) {
        sendBadRequest(req, res, "No password provided.")
        return
    } else if (typeof req.body.password !== "string") {
        sendBadRequest(res, `Property 'password' should be of type string, received ${typeof req.body.password} instead`)
        return
    }

    // Verifies the role was provided
    if (req.body.role === undefined) {
        sendBadRequest(req, res, "No role provided.")
        return
    } else if (typeof req.body.role !== "string") {
        sendBadRequest(res, `Property 'role' should be of type string, received ${typeof req.body.role} instead`)
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
    const password_hash = bcrypt.hashSync(req.body.password, parseInt(env.salt_rounds))

    // Inserts the user data into the database
    query_options = [req.body.username, password_hash, req.body.role]
    database_response = await database_pool.query("INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Unable to register account.")
        return
    }

    // Get's the new user's id
    const user_id = database_response.rows[0].id

    // Queries the database for all the flashcards
    database_response = await database_pool.query("SELECT * FROM flashcards ORDER BY id;")

    // The pg module does not parse numerical values when returning a query response so this must be done manually
    for (const flashcard of database_response.rows) {
        query_options = [user_id, flashcard.id, flashcard.category_id]
        database_response = await database_pool.query("INSERT INTO users_flashcards (user_id, flashcard_id, category_id, status, is_favorite) VALUES ($1, $2, $3, 'Needs studying', false) RETURNING *;", query_options)
    }

    // Logs the new user in
    loginUser(req, res)
}

// Whenever this route is called, login a user
const loginUser = async (req, res) => {

    // Verifies the username was provided
    if (req.body.username === undefined) {
        sendBadRequest(req, res, "No username provided.")
        return
    } else if (typeof req.body.username !== "string") {
        sendBadRequest(res, `Property 'username' should be of type string, received ${typeof req.body.username} instead`)
        return
    }

    // Verifies the password was provided
    if (req.body.password === undefined) {
        sendBadRequest(req, res, "No password provided.")
        return
    } else if (typeof req.body.password !== "string") {
        sendBadRequest(res, `Property 'password' should be of type string, received ${typeof req.body.password} instead`)
        return
    }

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

    // Get's the user's role
    query_options = [user_id]
    database_response = await database_pool.query("SELECT role FROM users WHERE id = $1;", query_options)
    const role = database_response.rows[0].role

    // Regenerates the session
    req.session.regenerate(() => {

        // Sets session variables
        req.session.authenticated = true
        req.session.user_id = user_id
        req.session.role = role

        // Sends success
        res.json({ message: "Success" })
    })
}

// Exports a function to add all the routes
const addAuthenticationRoutes = (server) => {

    // Whenever this route is called, return a session's CSRF token
    server.get("/csrf-token", getCSRFToken)

    // Whenever this route is called, return whether a user is authenticated
    server.get("/authenticated", getAuthenticated)

    // Whenever this route is called, create a new user
    server.post("/register", registerUser)

    // Whenever this route is called, login a user
    server.post("/login", loginUser)
}

export default addAuthenticationRoutes