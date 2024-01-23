// The process module allows us to interact with the OS process running this application
import { env } from "process"

// This function sends a request to the web application in order to prevent the site from shutting down due to inactivity
export const renderKeepAlive = () => {

    // Determines the URL to send requests to
    let url = undefined
    if (env.environment === "production") {
        url = "https://blue-ocean-back-end-production.onrender.com/"
    } else {
        url = "https://blue-ocean-back-end.onrender.com"
    }

    // Sends a request every 10 minutes
    setInterval(() => {
        fetch(url)
    }, 10 * 60 * 1000)

}

// Exports our keep alive function
export default renderKeepAlive