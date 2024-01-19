// This function is used to send a bad request response
export const sendBadRequest = (req, res, err) => {
    res.status(400)
    res.json({ message: err })
}

// Exports all the routes
export default {
    sendBadRequest
}