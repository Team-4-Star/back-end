// Imports our server object
import server from "./server/server.js"

// Imports the chalk module for colored output
import chalk from "chalk"

// The process module allows us to interact with the OS process running this application
import { env } from "process"

import renderKeepAlive from "./util/render-keep-alive.js"

// This is where program execution begins
const start = () => {

    // Listens for incoming connections
    const server_port = env.server_port
    server.listen(server_port, () => {
        console.log(chalk.bold.green(`Server running on port ${server_port}`))
    })

    // If we are in production, start the process to stay alive
    if (env.environment === "production") {
        renderKeepAlive()
    }

}

// Starts our program
start()