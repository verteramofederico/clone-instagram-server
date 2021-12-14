const express = require("express");
const routes = express.Router();

routes.post('/users', (req, res) => {
    res.json({ message: 'hola' })
})

module.exports = routes