// The express module allows us to easily create and manage HTTP servers
import express from "express"

// Imports our add middleware function
import addMiddleware from "./middleware.js"

// Imports our add settings function
import addSettings from "./settings.js"

// Imports our add routes function
import addRoutes from "./routes.js"

// Creates our express server instance
const server = express()

// Adds the middleware
addMiddleware(server)

// Adds our settings
addSettings(server)

// Adds our routes
addRoutes(server)

// Exports our server object
export default server