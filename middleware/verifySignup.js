const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    console.log("Request Object: ", req);
    // Username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            return res.status(400).send({
                message: "Erreur! le compte utilisateur est déjà existant!"
            });
        }

        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(userByEmail => {
            if (userByEmail) {
                return res.status(400).send({
                    message: "Erreur! l'email utilisateur est déjà existant!"
                });
            }
            // Continue to the next middleware if everything is fine
            next();
        });
    });
};

checkRolesExisted = (req, res, next) => {
    if (req.body && req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({
                    message: "Erreur! le rôle n'existe pas = " + req.body.roles[i]
                });
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
