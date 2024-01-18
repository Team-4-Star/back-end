// This function sends a request to the web application in order to prevent the site from shutting down due to inactivity
export const renderKeepAlive = () => {

    // Sends a request every 10 minutes
    setInterval(() => {
        const url = "https://blue-ocean-back-end.onrender.com"
        fetch(url)
    }, 10 * 60 * 1000)

}

// Exports our keep alive function
export default renderKeepAlive