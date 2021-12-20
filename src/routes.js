const express = require("express");
const routes = express.Router();
const multer = require("multer");
const multerConfig = require('./utils/multer')

const authMiddleware = require('./middleware/auth')

const UserController = require('./controllers/UserController')

const ValidationsUser = require('./middleware/validationUser')

routes.get('/users/:username', authMiddleware ,UserController.show)
routes.post('/users', ValidationsUser.withPassword ,UserController.store)
routes.put('/users', authMiddleware, ValidationsUser.withoutPassword ,UserController.update)
routes.put('/password-update', authMiddleware, ValidationsUser.password ,UserController.updatePassword)
routes.put('/avatar', authMiddleware, multer(multerConfig).single("file"), UserController.updateAvatar)


module.exports = routes