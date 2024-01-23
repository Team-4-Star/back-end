// Imports our database pool object
import database_pool from "../../database/database.js"

// Imports our utility routes
import { sendUnauthorized, sendForbidden, sendBadRequest, sendInternalServerError } from "./utility-routes.js"

// Whenever this route is called, create a flashcard
const createFlashcard = async (req, res) => {

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

    // Verifies a word was provided
    if (req.body.word === undefined) {
        sendBadRequest(req, res, "No word provided.")
        return
    } else if (typeof req.body.word !== "string") {
        sendBadRequest(res, `Property 'word' should be of type string, received ${typeof req.body.word} instead`)
        return
    }

    // Verifies a definition was provided
    if (req.body.definition === undefined) {
        sendBadRequest(req, res, "No definition provided.")
        return
    } else if (typeof req.body.definition !== "string") {
        sendBadRequest(res, `Property 'definition' should be of type string, received ${typeof req.body.definition} instead`)
        return
    }

    // Verifies a category id was provided
    if (req.body.category_id === undefined) {
        sendBadRequest(req, res, "No category ID provided.")
        return
    } else if (typeof req.body.category_id !== "number") {
        sendBadRequest(req, res, `Property 'category_id' should be of type number, received ${typeof req.body.category_id} instead`)
        return
    }

    // Verfies the category id is valid
    query_parameters = [req.body.category_id]
    database_response = await database_pool.query("SELECT * FROM flashcard_categories WHERE id = $1 LIMIT 1;", query_parameters)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, `No flashcard cateogry exists with ID ${req.body.category_id}`)
        return
    }

    // Creates the flashcard
    query_parameters = [req.body.word, req.body.definition, req.body.category_id]
    database_response = await database_pool.query("INSERT INTO flashcards (word, definition, category_id) VALUES ($1,$2,$3) RETURNING *;", query_parameters)

    // Verifies the flashcard was created
    if (database_response.rowCount === 0) {
        sendInternalServerError(req, res, "Unable to create flashcard.")
        return
    }

    // Grabs the flashcard
    const flashcard = database_response.rows[0]

    // Gets an array of all the users
    database_response = await database_pool.query("SELECT id FROM users;")
    const users = database_response.rows

    // Goes through each user and adds the newly created flashcard
    for (let user of users) {
        query_parameters = [user.id, flashcard.id, flashcard.category_id]
        database_response = await database_pool.query("INSERT INTO users_flashcards (user_id, flashcard_id, category_id, status) VALUES ($1, $2, $3, 'Needs studying') RETURNING *;", query_options)
    }

}

// Whenever this route is called, return all the flashcards
const readAllFlashcards = async (req, res) => {

    // If a user is authenticated, return their flashcards
    if (req.session.authenticated) {
        readAllUsersFlashcards(req, res)
    }

    // Otherwise, return public flashcards
    else {
        readAllPublicFlashcards(req, res)
    }
}

// Whenever this route is called, return all the flashcards
const readAllPublicFlashcards = async (req, res) => {

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

// Whenever this route is called, return all the user's flashcards
const readAllUsersFlashcards = async (req, res) => {

    // Verifies a user is authenticated
    if (!req.session.authenticated) {
        sendBadRequest(req, res, "User not authenticated.")
        return
    }

    // Performs the query and returns the results to the client
    const query_options = [req.session.user_id]
    const database_response = await database_pool.query("SELECT * FROM users_flashcards WHERE user_id = $1;", query_options)
    res.json(database_response.rows)
}

// Whenever this route is called, update a flashcard
const updateFlashcard = async (req, res) => {

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

    // Verifies an id was provided
    if (req.body.id === undefined) {
        sendBadRequest(req, res, "No ID provided.")
        return
    } else if (typeof req.body.id !== "number") {
        sendBadRequest(res, `Property 'id' should be of type number, received ${typeof req.body.id} instead`)
        return
    }

    // Verifies a word was provided
    if (req.body.word === undefined) {
        sendBadRequest(req, res, "No word provided.")
        return
    } else if (typeof req.body.word !== "string") {
        sendBadRequest(res, `Property 'word' should be of type string, received ${typeof req.body.word} instead`)
        return
    }

    // Verifies a definition was provided
    if (req.body.definition === undefined) {
        sendBadRequest(req, res, "No definition provided.")
        return
    } else if (typeof req.body.definition !== "string") {
        sendBadRequest(res, `Property 'definition' should be of type string, received ${typeof req.body.definition} instead`)
        return
    }

    // Verifies a category id was provided
    if (req.body.category_id === undefined) {
        sendBadRequest(req, res, "No category ID provided.")
        return
    } else if (typeof req.body.definition !== "number") {
        sendBadRequest(res, `Property 'category_id' should be of type number, received ${typeof req.body.category_id} instead`)
        return
    }

    // Verfies the category id is valid
    query_parameters = [req.body.category_id]
    database_response = await database_pool.query("SELECT * FROM flashcard_categories WHERE id = $1 LIMIT 1;", query_parameters)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, `No flashcard cateogry exists with ID ${req.body.category_id}`)
        return
    }

    // Updates the flashcard
    query_parameters = [req.body.category_id, req.body.word, req.body.definition, req.body.id]
    database_response = await database_pool.query("UPDATE commands SET category_id = $1, word = $2, definition = $3 WHERE id = $4 RETURNING *;", query_parameters)

    // Verifies the flashcard was updated
    if (database_response.rowCount === 0) {
        sendInternalServerError(req, res, "Unable to update flashcard.")
        return
    } else {
        res.send("Flashcard sucessfully updated.")
    }
}

// Whenever this route is called, delete a flashcard
const deleteFlashcard = async (req, res) => {

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

    // Verifies an id was provided
    if (req.body.id === undefined) {
        sendBadRequest(req, res, "No ID provided.")
        return
    } else if (typeof req.body.id !== "number") {
        sendBadRequest(res, `Property 'id' should be of type number, received ${typeof req.body.id} instead`)
        return
    }

    // Deletes the flashcard
    query_parameters = [req.body.id]
    database_response = await database_pool.query("DELETE FROM flashcards WHERE id = $1 RETURNING *;", query_parameters)

    // Verifies the flashcard was deleted
    if (database_response.rowCount === 0) {
        sendInternalServerError(req, res, "Unable to delete flashcard.")
        return
    } else {
        res.send("Flashcard sucessfully deleted.")
    }
}

// Exports a function to add all the routes
const addFlashCardRoutes = (server) => {

    // Whenever this route is called, create a new flashcard
    server.post("/flashcards", createFlashcard)

    // Whenever this route is called, return all the flashcards
    server.get("/flashcards", readAllFlashcards)

    // Whenever this route is called, update a flashcard
    server.put("/flashcards", updateFlashcard)
    server.patch("/flashcards", updateFlashcard)

    // Whenever this route is called, delete a flashcard
    server.delete("/flashcards", deleteFlashcard)
}

export default addFlashCardRoutes