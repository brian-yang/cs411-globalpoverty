const express = require('express');
const mysql = require('mysql');
const secrets = require("../secrets.js");
const router = express.Router();
const connection = mysql.createConnection(secrets.getSqlCredentials());

var pool = mysql.createPool({
    connectionLimit: 10,
    ...secrets.getSqlCredentials(),
});

router.get('/test', (req, res) => {
    res.json({ data: "Hello World" });
});

router.post('/find', (req, res) => {
    // Parse request here
    var country = "United States";
    var minYear = 1980;
    var maxYear = 2000;
    var str_min = minYear.toString();
    var str_max = maxYear.toString();

    var query = "SELECT * FROM extremePoverty WHERE year > " + str_min + " AND year < " + str_max + " AND entity = \"" + country + "\""
    var data = "";

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, result) {
            connection.release();
            if (err) throw err;

            for (var i = 0; i < result.length; i++) {
                data += result[i].entity + " " + result[i].code + " " + result[i].year + " " + result[i].percentExtremePoverty + "\n";
            }
            console.log(data);
            res.send(data);
        });
    });
})

router.post('/insert', (req, res) => {
    // Parse request
    var country = "United States";
    var year = 1980;
    var percent = 59.2;
    var str_con = "(\'" + country + "\',";
    var str_code = " ,";
    var str_year = year.toString() + ",";
    var str_percent = percent.toString() + ")";
    //var result = updateConnection("INSERT INTO extremePoverty VALUES " + str_con + str_code + str_year + str_percent);
    res.status(200);
    // Insert row into database here
});

router.post('/update', (req, res) => {
    // Parse request
    var country = "United States";
    var year = 1980;
    var percent = 59.2;
    res.status(200);
    // Update row
    console.log(req);
});

router.post('/delete', (req, res) => {
    // Parse request
    var country = "United States";
    var year = 1980;
    var str_country = "\"" + country + "\"";
    var str_year = year.toString();
    var query = "DELETE FROM extremePoverty WHERE entity = " + country + " AND year = " + str_year;
    //var result = updateConnection(query);
    //res.send(result);
    res.status(200);

    // Delete row from database here

    console.log("4");
});

module.exports = router;

// testConnection("SELECT * FROM extremePoverty WHERE year > 1980 AND year < 2000 AND country = \"United States\"");
// function searchConnection(query) {
//     connection = mysql.createConnection(secrets.getSqlCredentials());
//     connection.connect();
//     var res = connection.query(query, function (err, result, fields) {
//         // if any error while executing above query, throw error
//         if (err) {
//             // connection.end();
//             return "error";
//         }
//         // if there is no error, you have the result
//         for (var i = 0; i < result.length; i++){
//             res += result[i].entity + " " + result[i].code + " " + result[i].year + " " + result[i].percentExtremePoverty + "\n";
//         }
//         return res;
//     });
//     // const res = await connection.query(query);
//     connection.end();
//     console.log(res);

//     // return res;
// }


function updateConnection(query) {
    connection = mysql.createConnection(secrets.getSqlCredentials());
    connection.connect();
    connection.query(query, function (err, result, fields) {
        // if any error while executing above query, throw error
        if (err) {
            connection.end();
            return error;
        }
        connection.end();
        return "success";
    });
}