const express = require('express');
const router = express.Router();

const request = require('superagent');
const async = require('async');

router.get('/test', (req, res) => {
    // Parse req
    // Call database/sql.js functions to retrieve data
    res.send("Testing");
});

module.exports = router;