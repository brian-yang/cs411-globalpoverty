const express = require('express');
const next = require('next');
const mysql = require('mysql');
const secrets = require("./secrets.js");

const connection = mysql.createConnection(secrets.getSqlCredentials());
connection.connect();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/**
 *  Code to test connection to MySQL. You should see "The solution is: 2" in your terminal.
 */
// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//     if (err) {
//         throw err;
//     }
//     console.log('The solution is:', rows[0].solution);
// })

app.prepare()
    .then(() => {
        const server = express();

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, (err) => {
            if (err) {
                throw err;
            }
            console.log('Ready on http://localhost:3000');
        });
    })
    .catch((ex) => {
        console.error(ex.stack);
        connection.end();
        process.exit(1);
    })