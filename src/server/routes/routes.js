import addCommandRoutes from "./command-routes.js"
import addFlashcardRoutes from "./flashcard-routes.js"
import addAuthenticationRoutes from "./authentication-routes.js"
import addAuthorizationRoutes from "./authorization-routes.js"

// Applies routes to the server instance
export default (server) => {

    addCommandRoutes(server)
    addFlashcardRoutes(server)
    addAuthenticationRoutes(server)
    addAuthorizationRoutes(server)

}