const express = require("express");
const routes = express.Router();

const UserController = require('./controllers/UserController')

const ValidationsUser = require('./validations/validationUser')

routes.post('/users', ValidationsUser.withPassword ,UserController.store)

module.exports = routes