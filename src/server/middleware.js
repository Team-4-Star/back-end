// Imports our database pool object
import database_pool from "../database/database.js"

// The process module allows us to interact with the OS process running this application
import { env } from "process"

// The express module contains many built in middlewares
import { json } from "express"

// The cors module allows us to disable CORS protection
import cors from "cors"

// The express-session module allows us to create and manage sessions
import express_session from "express-session"

// The connect-pg-simple module helps us with storing sessions in our database
import connect_pg_simple from "connect-pg-simple"

// The express-rate-limit module allows us to limit the rate at which requests are handled
import express_rate_limit from "express-rate-limit"

// The lusca module is a comprehensive security library for Express which includes CSRF protection among other features
import lusca from "lusca"

// Applies middleware to the server instance
export default (server) => {

    // Parses the body of any incoming requests and converts it into an object if the body is a JSON string
    server.use(json())

    server.use(cors())

    // Applies a rate limiting of 500 requests per 1 minute window
    server.use(express_rate_limit({
        windowMs: 1 * 60 * 1000,
        max: 500,
    }))

    // Middleware for session management
    server.use(express_session({
        store: new (connect_pg_simple(express_session))({
            pool: database_pool,
            tableName: "sessions"
        }),
        secret: env.session_key,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: env.secure_cookies === "true",
            sameSite: "Strict"
        }
    }))
}
