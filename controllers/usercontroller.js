const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/dist");
const { UserModel } = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post("/register", async (req, res) => {
    let { username, passwordhash } = req.body;
    try {
        const User = await UserModel.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 10)
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use",
            })
        } else {
            res.status(500).json({
                message: "Failed to register user",
            })
        }
    }
});

router.post("/login", async (req, res) => {
    let { username, passwordhash } = req.body;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                username: username,
            },
        });

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash);

            if (passwordComparison) {
                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!"
                });
            } else {
                res.status(401).json({
                    message: "Incorrect Username or Password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect Username or Password"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});


module.exports = router;