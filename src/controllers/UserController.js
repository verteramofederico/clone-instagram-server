const sequelize = require("sequelize");
const db = require('../database/models');

module.exports = {
    async store(req, res) {
        const {name, email, username, password} = req.body
        const user = await db.User.create({
            name, 
            email, 
            username, 
            password
        });
        res.json({user})
    }
}