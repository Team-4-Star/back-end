// The process module allows us to interact with the OS process running this application
import { url } from "inspector"
import { env } from "process"

// This function sends a request to the web application in order to prevent the site from shutting down due to inactivity
export const renderKeepAlive = () => {

    // Determines the URL to send requests to
    let urls = []
    urls.push(env.front_end_origin)
    if (env.environment === "production") {
        urls.push("https://blue-ocean-back-end-production.onrender.com/")
    } else {
        urls.push("https://blue-ocean-back-end.onrender.com")
    }

    // Sends the requests every 10 minutes
    for (const url of urls) {
        setInterval(() => {
            fetch(url)
        }, 10 * 60 * 1000)
    }

}

// Exports our keep alive function
export default renderKeepAlive
