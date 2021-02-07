const express = require('express');
const uuid = require('uuid').uuidv4;
const app = express();
const port = 3000;

app.use((req, res, next) => {
    req.id = uuid;
    console.log(`${req.method}: ${req.path} ${Date()}`)
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    res.send('POST');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});