// Whenever this route is called, return a user's role
const getRole = (req, res) => {

    // If a user is not logged in, they are given the role "public"
    if (!req.session.user_id) {
        res.json({ role: "public" })
    }

    // Otherwise, they are given their user accounts role
    else {
        res.json({ role: req.session.role })
    }
}

// Exports a function to add all the routes
const addAuthorizationRoutes = (server) => {

    // Whenever this route is called, return a user's role
    server.get("/role", getRole)
}

export default addAuthorizationRoutes