"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const app_1 = require("../app");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
class UserController {
    static async getAllUsers(req, res) {
        app_1.db.query(`SELECT * FROM users`, async (error, results) => {
            if (error)
                throw error;
            else if (results.length === 0) {
                return res.status(401).send({ message: 'Aucun utilisateur trouvé !' });
            }
            else {
                return res.status(200).send({
                    users: results
                });
            }
        });
    }
    static async loginToUserAccount(req, res) {
        const body = req.body;
        const bodyUser = {
            email: body.email,
            password: body.password
        };
        if (bodyUser.email !== '' && bodyUser.password !== '') {
            app_1.db.query(`SELECT * FROM users WHERE email = ?`, [bodyUser.email], async (error, results) => {
                if (error)
                    throw error;
                else if (results.length === 0) {
                    return res.status(401).send({ message: 'Aucun utilisateur trouvé !' });
                }
                else {
                    const compareHashPassword = await bcryptjs_1.default.compare(bodyUser.password, results[0].password);
                    if (!compareHashPassword) {
                        return res.status(401).json({ message: "Mot de passe invalide" });
                    }
                    const accessToken = (0, auth_1.generateAccessToken)(results[0].user_id);
                    (0, auth_1.setTokenCookie)(res, accessToken);
                    return res.status(200).send({
                        message: "Authentification réussie",
                        userId: results[0].user_id,
                        userRole: results[0].role,
                        accessToken
                    });
                }
            });
        }
        else {
            res.status(400).json({ error: 'Certains champs sont manquants.' });
        }
    }
    static async logoutToAccount(req, res) {
        try {
            (0, auth_1.clearTokenCookie)(res);
            res.status(200).json({ message: "Utilisateur déconnecté" });
        }
        catch (error) {
            res.status(400).json({ message: "Une erreur s'est produite lors de la déconnexion" });
        }
    }
    static async deleteUser(req, res) {
        const requestId = parseInt(req.params.user);
        try {
            app_1.db.execute(`DELETE FROM users WHERE user_id = ${requestId}`, (error, results) => {
                if (error)
                    throw error;
                else if (results.affectedRows === 0) {
                    res.status(404).send({ message: 'L\'identifiant n\'existe pas ou n\'a pas le bon format.' });
                }
                else {
                    (0, auth_1.clearTokenCookie)(res);
                    res.status(200).send({ message: 'L\'utilisateur a été supprimé !' });
                }
            });
        }
        catch (error) {
            res.status(400).json({ message: "Internal server error" });
        }
    }
}
exports.UserController = UserController;
