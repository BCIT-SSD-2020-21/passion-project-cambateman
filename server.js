const express = require('express');
const server = express();

server.get('/', (req, res) => {
    res.send("Hello from scouting.com")
})

server.listen(8080, () => {
    console.log("Serving on port 8080")
})