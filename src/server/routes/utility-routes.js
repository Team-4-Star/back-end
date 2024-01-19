// This function is used to send a bad request response
export const sendBadRequest = (req, res, err = "Bad Request") => {
    res.status(400)
    res.json({ message: err })
}

// This function is used to send an unauthorized response
export const sendUnauthorized = (req, res, err = "Unauthorized") => {
    res.status(401)
    res.json({ message: err })
}

// This function is used to send a forbidden response
export const sendForbidden = (req, res, err = "Forbidden") => {
    res.status(403)
    res.json({ message: err })
}

// This function is used to send an internal server error response
export const sendInternalServerError = (req, res, err = "Internal Server Error") => {
    res.status(500)
    res.json({ message: err })
}

// Exports all the routes
export default {
    sendBadRequest
}