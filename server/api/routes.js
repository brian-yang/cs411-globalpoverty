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

router.post('/listCountries', (req, res) => {
    var query = "SELECT DISTINCT entity FROM extremePoverty ORDER BY entity ASC";
    var countries = [];

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            connection.release();
            if (err) throw err;

            for (var i = 0; i < rows.length; i++) {
                countries.push(rows[i].entity);
            }

            res.status(200).json({
                countries: countries,
            })
        });
    });
})

router.post('/listRegions', (req, res) => {
    var query = "SELECT DISTINCT region FROM region_poverty_share ORDER BY region ASC";
    var regions = [];

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            connection.release();
            if (err) throw err;

            for (var i = 0; i < rows.length; i++) {
                regions.push(rows[i].region);
            }

            res.status(200).json({
                regions: regions,
            })
        });
    });
})

router.post('/find', (req, res) => {
    const { location, minYear, maxYear, type } = req.body;

    var table = "extremePoverty";
    var locationType = "entity";
    var percentageType = "percentExtremePoverty";
    var yearType = "year";
    if (type === 'World Region') {
        table = "region_poverty_share";
        locationType = "region";
        percentageType = "Share";
        yearType = "Year";
    }

    var query = "SELECT DISTINCT * FROM " + table + " WHERE year >= " + minYear + " AND year <= " + maxYear + " AND " + locationType + " = \"" + location + "\"" +
        " ORDER BY " + yearType + " ASC"
    var data = [];

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            connection.release();
            if (err) throw err;

            for (var i = 0; i < rows.length; i++) {
                const row = rows[i];
                data.push({
                    xValue: row[yearType],
                    yValue: row[percentageType],
                })
            }
            res.send({ graphData: data });
        });
    });
})

router.post('/insert', (req, res) => {
    const { location, year, percentage, type } = req.body;

    var table = "extremePoverty";
    var locationType = "entity";
    var percentageType = "percentExtremePoverty";
    var yearType = "year";
    if (type === 'World Region') {
        table = "region_poverty_share";
        locationType = "region";
        percentageType = "Share";
        yearType = "Year";
    }

    var query = "INSERT INTO " + table + " (" + locationType + "," + yearType + "," + percentageType + ")" +
        " VALUES(\"" + location + "\"," + year + "," + percentage + ");";

    console.log(query);

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, result) {
            connection.release();
            if (err) throw err;
            res.send({ location: location, year: year });
        });
    });
});

router.post('/update', (req, res) => {
    const { location, year, percentage, type } = req.body;

    var table = "extremePoverty";
    var locationType = "entity";
    var percentageType = "percentExtremePoverty";
    var yearType = "year";
    if (type === 'World Region') {
        table = "region_poverty_share";
        locationType = "region";
        percentageType = "Share";
        yearType = "Year";
    }

    var query = "UPDATE " + table + " SET " + percentageType + "=" + percentage + " WHERE " +
        locationType + "=\"" + location + "\" AND " + yearType + "=" + year + ";";

    console.log(query);

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, result) {
            connection.release();
            if (err) throw err;

            res.status(200);
        });
    });
});

router.post('/delete', (req, res) => {
    const { location, year, type } = req.body;

    var table = "extremePoverty";
    var locationType = "entity";
    var percentageType = "percentExtremePoverty";
    var yearType = "year";
    if (type === 'World Region') {
        table = "region_poverty_share";
        locationType = "region";
        percentageType = "Share";
        yearType = "Year";
    }

    var query = "DELETE FROM " + table + " WHERE " +
        locationType + "=\"" + location + "\" AND " + yearType + "=" + year + ";";

    console.log(query);

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, result) {
            connection.release();
            if (err) throw err;
            res.send({ location: location, year: year });
        });
    });
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
