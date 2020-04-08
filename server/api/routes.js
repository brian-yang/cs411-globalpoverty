const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    // Parse req
    // Call database/sql.js functions to retrieve data
    res.json({ data: "Hello World" });
});

module.exports = router;