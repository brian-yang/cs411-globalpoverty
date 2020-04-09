const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ data: "Hello World" });
});

router.post('/find', (req, res) => {
    // Parse request here
    var country = "United States";
    var minYear = 1980;
    var maxYear = 2000;
    res.status(200);
    // Find rows here using the range [minYear, maxYear]
});

router.post('/insert', (req, res) => {
    // Parse request
    var country = "United States";
    var year = 1980;
    var percent = 59.2;
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
});

router.post('/delete', (req, res) => {
    // Parse request
    var country = "United States";
    var year = 1980;
    res.status(200);
    // Delete row from database here
});

module.exports = router;