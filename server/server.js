const express = require('express');
const next = require('next');
const api = require("./api/routes.js");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


app.prepare()
    .then(() => {
        const server = express();

        server.use(express.json({ limit: '50mb', extended: true }));
        server.use(express.json({ limit: '50mb' }));

        server.use("/api", api);

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
        process.exit(1);
    })