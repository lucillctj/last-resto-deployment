"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const app_1 = require("../app");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
class AdminController {
    static async createAdminAccount(req, res, next) {
        const body = req.body;
        const bodyAdmin = {
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            phone: body.phone,
            password: body.password,
            role: 'admin',
        };
        const hashPassword = await bcryptjs_1.default.hash(bodyAdmin.password, 10);
        try {
            if (bodyAdmin.firstName !== '' && bodyAdmin.lastName !== '' && bodyAdmin.email !== '' && bodyAdmin.phone !== '' && bodyAdmin.password !== '' && Object.keys(body).length === 5) {
                const sql = `INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
                const params = [bodyAdmin.firstName, bodyAdmin.lastName, bodyAdmin.email, bodyAdmin.phone, hashPassword, 'admin'];
                app_1.db.execute(sql, params, async (error, results) => {
                    if (error) {
                        await errorValues(req, res, error, bodyAdmin);
                    }
                    else {
                        const accessToken = (0, auth_1.generateAccessToken)(results.insertId);
                        res.status(201).send({
                            message: `Utilisateur avec le rôle 'admin' a été créé !`,
                            accessToken
                        });
                    }
                });
            }
            else {
                res.status(400).json({ error: 'Certains champs sont manquants ou incorrects.' });
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Erreur !' });
        }
    }
    static async loginToAdminAccount(req, res) {
        const body = req.body;
        const bodyAdmin = {
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            phone: body.phone,
            password: body.password,
            role: 'admin',
        };
        if (bodyAdmin.email !== '' && bodyAdmin.password !== '' && Object.keys(body).length === 2) {
            app_1.db.query(`SELECT * FROM users WHERE role = 'admin' AND email = ?`, [bodyAdmin.email], async (error, results) => {
                if (error)
                    throw error;
                else if (results.length === 0) {
                    return res.status(401).send({ message: 'Aucun utilisateur trouvé !', accessToken: null });
                }
                else {
                    const compareHashPassword = await bcryptjs_1.default.compare(bodyAdmin.password, results[0].password);
                    if (!compareHashPassword) {
                        return res.status(401).json({ message: "Mot de passe invalide" });
                    }
                    const accessToken = (0, auth_1.generateAccessToken)(results.insertId);
                    return res.status(200).send({
                        message: "Authentification réussie",
                        accessToken
                    });
                }
            });
        }
        else {
            res.status(400).json({ error: 'Certains champs sont manquants.' });
        }
    }
    static async getAllAdmins(req, res) {
        try {
            app_1.db.query(`SELECT * FROM users WHERE role = 'admin'`, (error, results) => {
                return res.status(200).send(results);
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async getAdminDashboard(req, res) {
        const requestId = parseInt(req.params.id);
        try {
            app_1.db.query(`SELECT * FROM users WHERE role = 'admin' AND user_id = ${requestId}`, (error, results) => {
                if (error)
                    throw error;
                else if (results.length === 0) {
                    res.status(404).send({ message: 'L\'identifiant n\'existe pas ou n\'a pas le bon format.' });
                }
                else {
                    res.status(200).send(results);
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async updateAdmin(req, res) {
        const body = req.body;
        const requestId = parseInt(req.params.id);
        const bodyAdmin = {
            userId: requestId,
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            phone: body.phone,
            password: body.password,
            role: 'admin'
        };
        try {
            if (bodyAdmin.firstName !== '' && bodyAdmin.lastName !== '' && bodyAdmin.email !== '' && bodyAdmin.phone !== '' && bodyAdmin.password !== '' && Object.keys(body).length === 5) {
                const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, password = ? WHERE role = 'admin' AND user_id = ${requestId}`;
                const params = [bodyAdmin.firstName, bodyAdmin.lastName, bodyAdmin.email, bodyAdmin.phone, bodyAdmin.password];
                app_1.db.execute(sql, params, async (error, results) => {
                    if (error)
                        throw error;
                    else if (results.affectedRows === 0) {
                        res.status(404).send({ message: 'L\'identifiant n\'existe pas ou n\'a pas le bon format.' });
                    }
                    else {
                        res.status(201).send({ message: `Utilisateur avec le rôle 'admin' a été mis à jour !` });
                    }
                });
            }
            else {
                res.status(400).json({ error: 'Certains champs sont manquants ou incorrects.' });
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Erreur !' });
        }
    }
    static async deleteAdmin(req, res) {
        const requestId = parseInt(req.params.id);
        try {
            app_1.db.execute(`DELETE FROM users WHERE role = 'admin' AND user_id = ${requestId}`, (error, results) => {
                if (error)
                    throw error;
                else if (results.affectedRows === 0) {
                    res.status(404).send({ message: 'L\'identifiant n\'existe pas ou n\'a pas le bon format.' });
                }
                else {
                    res.status(200).send({ message: 'L\'utilisateur a été supprimé !' });
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.AdminController = AdminController;
function errorValues(req, res, error, newAdmin) {
    if (error.sqlMessage === `Duplicate entry '${newAdmin.email}' for key 'users.email'`) {
        res.status(400);
        res.send("Cet email existe déjà !");
    }
    else if (error.sqlMessage === `Duplicate entry '${newAdmin.phone}' for key 'users.phone'`) {
        res.status(400);
        res.send("Ce numéro de téléphone existe déjà !");
    }
    else {
        res.status(400);
        res.send("Erreur !");
    }
    res.end();
}
