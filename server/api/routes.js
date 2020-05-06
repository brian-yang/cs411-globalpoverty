const express = require('express');
const mysql = require('mysql');
const secrets = require("../secrets.js");
const router = express.Router();
const helper = require("../helper/helper.js");

var pool = mysql.createPool({
    connectionLimit: 10,
    ...secrets.getSqlCredentials(),
    multipleStatements: true,
});

router.get('/test', (req, res) => {
    res.json({ data: "Hello World" });
});

router.post('/listCountries', (req, res) => {
    var query = "SELECT DISTINCT entity FROM country_poverty_share ORDER BY entity ASC";
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

    var table = type === 'Country' ? "country_poverty_share" : "region_poverty_share";
    var locationType = type === 'Country' ? "Entity" : "Region";
    var percentageType = "Share";
    var yearType = "Year";

    var query = "SELECT DISTINCT * FROM " + table + " WHERE " + yearType + " >= " + minYear + " AND " + yearType + " <= " + maxYear + " AND " + locationType + " = \"" + location + "\"" +
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

    var table = type === 'Country' ? "country_poverty_share" : "region_poverty_share";
    var locationType = type === 'Country' ? "Entity" : "Region";
    var percentageType = "Share";
    var yearType = "Year";

    var query = "INSERT INTO " + table + " (" + locationType + "," + yearType + "," + percentageType + ")" +
        " VALUES(\"" + location + "\"," + year + "," + percentage + ");";

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

    var table = type === 'Country' ? "country_poverty_share" : "region_poverty_share";
    var locationType = type === 'Country' ? "Entity" : "Region";
    var percentageType = "Share";
    var yearType = "Year";

    var query = "UPDATE " + table + " SET " + percentageType + "=" + percentage + " WHERE " +
        locationType + "=\"" + location + "\" AND " + yearType + "=" + year + ";";

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

    var table = type === 'Country' ? "country_poverty_share" : "region_poverty_share";
    var locationType = type === 'Country' ? "Entity" : "Region";
    var yearType = "Year";

    var query = "DELETE FROM " + table + " WHERE " +
        locationType + "=\"" + location + "\" AND " + yearType + "=" + year + ";";

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, result) {
            connection.release();
            if (err) throw err;
            res.send({ location: location, year: year });
        });
    });
});

router.post('/uploadCSV', (req, res) => {
    const { data, fileName } = req.body;

    var tuples = helper.parseData(data);
    var fn = fileName.substr(0, fileName.length - 4);

    if (tuples !== null) {
        pool.getConnection(function (err, connection) {
            var dlt = "DROP TABLE IF EXISTS `" + fn + "`;";
            connection.query(dlt, function (err, result) {
                if (err) throw err;
            });

            var start = "CREATE TABLE `" + fn + "` (Entity VARCHAR(50) NOT NULL, Year INT(11) NOT NULL, Share DOUBLE NOT NULL)";
            connection.query(start, function (err, result) {
                if (err) throw err;
            });

            var tupleStr = "";

            for (var i = 1; i < tuples.length - 1; i++) {
                tupleStr += "(\"" + tuples[i][0] + "\"," + tuples[i][1] + "," + tuples[i][2] + "), ";
            }
            tupleStr += "(\"" + tuples[tuples.length - 1][0] + "\"," + tuples[tuples.length - 1][1] + "," + tuples[tuples.length - 1][2] + ");";

            var query = "INSERT INTO `" + fn + "` (Entity,Year,Share)" + " VALUES" + tupleStr;
            connection.query(query, function (err, result) {
                if (err) throw err;
            });

            connection.release();
        });
    }

    var message = "success";
    if (tuples === null) {
        message = "fail";
    }

    res.send({
        status: message,
        fileNameTruncated: fn,
        fileName: fileName,
    });
});

router.post('/getDatasetKeys', (req, res) => {
    const { datasetName } = req.body;

    pool.getConnection(function (err, connection) {
        var query = "SELECT Entity as entity,MAX(Year) as maxYear,MIN(Year) as minYear from `" + datasetName + "` GROUP BY Entity;";

        connection.query(query, function (err, rows) {
            if (err) throw err;
            connection.release();

            var entities = [];
            var minYear = 10000;
            var maxYear = 0;

            for (var i = 0; i < rows.length; i++) {
                entities.push(rows[i].entity);
                minYear = Math.max(1900, Math.min(minYear, rows[i].minYear));
                maxYear = Math.min(2020, Math.max(maxYear, rows[i].maxYear));
            }

            res.send({
                entities: entities,
                minYear: minYear,
                maxYear: maxYear,
            });
        });
    });

});

router.post('/findDatasetData', (req, res) => {
    const { datasetName, minYear, maxYear, country } = req.body;

    pool.getConnection(function (err, connection) {
        var query = "SELECT DISTINCT * FROM `" + datasetName + "` WHERE Year >= " + minYear + " AND Year <= " + maxYear + " AND Entity = \"" + country + "\"" +
            " ORDER BY Year ASC";

        connection.query(query, function (err, rows) {
            connection.release();
            if (err) throw err;

            var data = [];

            for (var i = 0; i < rows.length; i++) {
                const row = rows[i];
                data.push({
                    xValue: row["Year"],
                    yValue: row["Share"],
                })
            }

            res.send({ graphData: data });
        });
    });

});

module.exports = router;