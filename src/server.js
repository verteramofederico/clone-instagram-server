require('dotenv').config()

const express = require('express');
const path = require('path');

const routes = require('./routes')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/files', express.static(path.resolve(__dirname, '../', 'tmp', 'uploads')))

app.use(routes)

app.listen(process.env.Port || 3333)