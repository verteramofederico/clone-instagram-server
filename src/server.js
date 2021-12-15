require('dotenv').config()

const express = require('express');
let path = require('path');

const routes = require('./routes')

const app = express();

app.use(express.json())

app.use(routes)

app.listen(process.env.Port || 3333)