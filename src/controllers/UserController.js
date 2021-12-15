const Sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const db = require('../database/models');

let User = db.User // model

module.exports = {
    async store(req, res) {
        const {name, email, username, password} = req.body

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({
            where: { [Sequelize.Op.or]: [{ email }, { username }] }
        })

        if (user) {
            if (user.email === email)
                return res.status(400).json({ message: "Este email ya esta en uso" });
            if (user.username === username)
                return res.status(400).json({ message: "Este usuario ya esta en uso" });
        }
        
        user = await User.create({
            name, 
            email, 
            username, 
            password
        })

        res.json({user})
    }
}