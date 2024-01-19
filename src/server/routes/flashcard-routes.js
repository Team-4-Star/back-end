// Imports our database pool object
import database_pool from "../../database/database.js"

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

// Exports a function to add all the routes
const addFlashCardRoutes = (server) => {

    // Whenever this route is called, return all the flashcards
    server.get("/flashcards", readAllFlashcards)

    // Whenever this route is called, return all the flashcard categories
    server.get("/flashcards/categories", readAllFlashcardCategories)

}

export default addFlashCardRoutes