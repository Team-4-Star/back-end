// Imports our database pool object
import database_pool from "../../database/database.js"

// Imports our utility routes
import { sendUnauthorized, sendForbidden, sendBadRequest, sendInternalServerError } from "./utility-routes.js"

// Whenever this route is called, create a flashcard category
const createFlashcardCategory = async (req, res) => {

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

    // Verifies a name was provided
    if (req.body.name === undefined) {
        sendBadRequest(req, res, "No name provided.")
        return
    } else if (typeof req.body.word !== "string") {
        sendBadRequest(res, `Property 'name' should be of type string, received ${typeof req.body.name} instead`)
        return
    }

    // Creates the flashcard category
    query_parameters = [req.body.name]
    database_response = await database_pool.query("INSERT INTO flashcard_categories (name) VALUES ($1) RETURNING *;", query_parameters)

    // Verifies the flashcard was created
    if (database_response.rowCount === 0) {
        sendInternalServerError(req, res, "Unable to create flashcard category.")
        return
    } else {
        res.send("Flashcard category sucessfully created.")
    }
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

// Whenever this route is called, update a flashcard category
const updateFlashcardCategory = async (req, res) => {

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

    // Verifies a name was provided
    if (req.body.name === undefined) {
        sendBadRequest(req, res, "No name provided.")
        return
    } else if (typeof req.body.word !== "string") {
        sendBadRequest(res, `Property 'name' should be of type string, received ${typeof req.body.name} instead`)
        return
    }

    // Updates the flashcard category
    query_parameters = [req.body.name, req.body.id]
    database_response = await database_pool.query("UPDATE flashcard_categories SET name = $1 WHERE id = $2 RETURNING *;", query_parameters)

    // Verifies the flashcard category was updated
    if (database_response.rowCount === 0) {
        sendInternalServerError(req, res, "Unable to update flashcard category.")
        return
    } else {
        res.send("Flashcard category sucessfully updated.")
    }
}

// Whenever this route is called, delete a flashcard category
const deleteFlashcardCategory = async (req, res) => {

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

    // Deletes the flashcard category
    query_parameters = [req.body.id]
    database_response = await database_pool.query("DELETE FROM flashcard_categories WHERE id = $1 RETURNING *;", query_parameters)

    // Verifies the flashcard category was deleted
    if (database_response.rowCount === 0) {
        sendInternalServerError(req, res, "Unable to delete flashcard category.")
        return
    } else {
        res.send("Flashcard category sucessfully deleted.")
    }
}

// Exports a function to add all the routes
const addFlashCardCategoryRoutes = (server) => {

    // Whenever this route is called, create a new flashcard category
    server.post("/flashcards/categories", createFlashcardCategory)

    // Whenever this route is called, return all the flashcard categories
    server.get("/flashcards/categories", readAllFlashcardCategories)

    // Whenever this route is called, update a flashcard category
    server.put("/flashcards/categories", updateFlashcardCategory)
    server.patch("/flashcards/categories", updateFlashcardCategory)

    // Whenever this route is called, delete a flashcard category
    server.delete("/flashcards/categories", deleteFlashcardCategory)

}

export default addFlashCardCategoryRoutes