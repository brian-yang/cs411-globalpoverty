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

    console.log(query);

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            connection.release();
            if (err) throw err;

            for (var i = 0; i < rows.length; i++) {
                const row = rows[i];
                console.log(row);
                data.push({
                    xValue: row[yearType],
                    yValue: row[percentageType],
                })
            }

            console.log(data);
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

    var table = type === 'Country' ? "country_poverty_share" : "region_poverty_share";
    var locationType = type === 'Country' ? "Entity" : "Region";
    var percentageType = "Share";
    var yearType = "Year";

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

    var table = type === 'Country' ? "country_poverty_share" : "region_poverty_share";
    var locationType = type === 'Country' ? "Entity" : "Region";
    var yearType = "Year";

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

router.post('/uploadCSV', (req, res) => {
    const { data,filename } = req.body;

    var tuples = helper.parseData(data);
    console.log(tuples);
    var fn = filename.substr(0,filename.length-4);

    pool.getConnection(function (err,connection) {
        // var dlt = "DROP TABLE custom";
        var start = "CREATE TABLE " + fn + " (Entity VARCHAR(50) NOT NULL, Year INT(11) NOT NULL, Share DOUBLE NOT NULL)";
        console.log(start);
        // connection.query(dlt,function(err,result){
        // });
        connection.query(start,function(err,result){
            if(err) throw err;
        });


        for(var i = 0; i < tuples[1].length; i++){
            var query = "INSERT INTO " + fn +  " (Entity,Year,Share)" +" VALUES(\"" + tuples[1][i][0] + "\"," + tuples[1][i][1] + "," + tuples[1][i][2] + ");";
            console.log(query);
            connection.query(query,function(err,result){
                if(err) throw err;
            });
        }
        connection.release();
    });

    var message = "success";
    if (tuples == null) {
        message = "fail";
    }

    res.send(message);
});

module.exports = router;