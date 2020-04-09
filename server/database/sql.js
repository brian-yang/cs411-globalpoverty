const mysql = require('mysql');

/**
 *  Code to test connection to MySQL. You should see "The solution is: 2" in your terminal.
 */
function testConnection() {
    connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
        if (err) {
            throw err;
        }
        console.log('The solution is:', rows[0].solution);
    })
}