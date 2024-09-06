/**
 * database/connection.js
 *
 * Megagame Dashboard: Database connection functionality.
 */

const pgPromise = require('pg-promise')


const initOptions = {
    capSQL: true,
}

const getDatabaseConnection = function (connectionURL) {
    let pgp = pgPromise(initOptions)
    let connection = pgp(connectionURL)
    return connection
}


module.exports = {
    getDatabaseConnection,
}
