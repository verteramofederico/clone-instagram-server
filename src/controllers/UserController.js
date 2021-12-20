const Sequelize = require("sequelize");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require('../database/models')

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')


let User = db.User // model

const passwordHash = require('../utils/passwordHash')
const passwordCompare = require('../utils/passwordCompare')

module.exports = {
    async show (req, res) {
        const {username} = req.params

        const user = await User.findOne({ where: { username },
            attributes: {
                exclude: ["password", "updatedAt"]
                }
            })
    
        if (!user) {return res.status(404).send({message: 'Usuario no encontrado'})}

        return res.json(user)
    },
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

        // hash passwordHash
        const passwordHashed = await passwordHash(password)
        
        user = await User.create({
            name, 
            email, 
            username, 
            password: passwordHashed
        })

        // jwt
        const payload = { id: user.id, username: user.username };
        jwt.sign(
            payload,
            process.env.SIGNATURE_TOKEN,
            { expiresIn: 86400 },
            (error, token) => {
                if (error) {throw error};
                return res.json({ token });
            }
        )
    },
    async update (req, res) {
        const { name, email, username, phone, bio} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await User.update({ name, email, username, phone, bio}, 
            {where: {id: req.userId}})
        
        return res.json({ message: 'actualizado ok' });
    },
    async updatePassword(req, res) {
        const { password_old, password, password_confirm } = req.body;
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    
        const user = await User.findByPk(req.userId);
    
        if (!(await passwordCompare(password_old, user.password)))
        return res.status(400).json({ message: "No coincide la contraseña" })

        if (password !== password_confirm)
        return res.status(400).json({ message: "No coinciden el password ingresado" }) 
    
        // hash passwordHash
        const passwordHashed = await passwordHash(password)

        await User.update({password: passwordHashed }, {where: {id: req.userId}})

        return res.json({ message: "Password actualizado" });
    },
    async updateAvatar(req, res) {
        const key = req.file.filename
    
        promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", req.query.key)
        ) 
    
        const url = `${process.env.API_URL}/files/${key}`;
        await User.update(
        {
            key,
            avatar_url: url
        },
        { where: { id: req.userId } }
        );
        console.log(url, "post await")
        return res.json({ avatar_url: url } );
    },
}