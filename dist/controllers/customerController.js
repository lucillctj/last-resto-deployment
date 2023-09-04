"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const app_1 = require("../app");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
class CustomerController {
    static async createCustomerAccount(req, res) {
        const body = req.body;
        const bodyCustomer = {
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            phone: body.phone,
            password: body.password,
            address: body.address,
            postCode: body.post_code,
            city: body.city,
            role: 'customer'
        };
        const hashPassword = await bcryptjs_1.default.hash(bodyCustomer.password, 10);
        try {
            if (bodyCustomer.firstName !== '' &&
                bodyCustomer.lastName !== '' &&
                bodyCustomer.email !== '' &&
                bodyCustomer.phone !== '' &&
                bodyCustomer.password !== '' &&
                bodyCustomer.address !== '' &&
                bodyCustomer.postCode !== '' &&
                bodyCustomer.city !== '' &&
                Object.keys(body).length === 8) {
                const sql = `INSERT INTO users (first_name, last_name, email, phone, password, role, address, post_code, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const params = [
                    bodyCustomer.firstName,
                    bodyCustomer.lastName,
                    bodyCustomer.email,
                    bodyCustomer.phone,
                    hashPassword,
                    'customer',
                    bodyCustomer.address,
                    bodyCustomer.postCode,
                    bodyCustomer.city
                ];
                app_1.db.execute(sql, params, async (error, results) => {
                    if (error) {
                        await errorValues(req, res, error, bodyCustomer);
                    }
                    else {
                        const accessToken = (0, auth_1.generateAccessToken)(results.insertId);
                        (0, auth_1.setTokenCookie)(res, accessToken);
                        res.status(201).send({
                            message: `Utilisateur avec le rôle 'customer' a été créé !`,
                            userId: results.insertId,
                            accessToken
                        });
                    }
                });
            }
            else {
                res
                    .status(400)
                    .json({ error: 'Certains champs sont manquants ou incorrects.' });
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Erreur !' });
        }
    }
    static async getCustomerDashboard(req, res) {
        const userId = parseInt(req.params.user);
        try {
            app_1.db.query(`SELECT * FROM users WHERE role = 'customer' AND user_id = ${userId}`, (error, results) => {
                if (error)
                    throw error;
                else if (results.length === 0) {
                    res
                        .status(404)
                        .send("L'identifiant n'existe pas ou n'a pas le bon format.");
                }
                else {
                    res.status(200).send(results[0]);
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getDataCustomer(req, res) {
        const userId = parseInt(req.params.customer);
        try {
            app_1.db.query(`SELECT * FROM users WHERE role = 'customer' AND user_id = ${userId}`, (error, results) => {
                if (error)
                    throw error;
                else if (results.length === 0) {
                    res
                        .status(404)
                        .send("L'identifiant n'existe pas ou n'a pas le bon format.");
                }
                else {
                    res.status(200).send(results[0]);
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getUserIdByProductId(req, res) {
        const requestId = parseInt(req.params.id);
        try {
            app_1.db.query(`SELECT user_id FROM users WHERE product_id = ${requestId}`, (error, userIds) => {
                if (error)
                    throw error;
                else if (!userIds) {
                    res
                        .status(404)
                        .send({ message: 'No-one has reserved this product' });
                }
                else {
                    res.status(200).send(userIds);
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    // public static async deleteProductIdByUserId(req: Request, res: Response): Promise<void> {
    //     const userId = parseInt(req.params.user);
    //
    //     try {
    //         db.query(
    //             `UPDATE users SET product_id = NULL WHERE role = 'customer' AND user_id = ${userId}`,
    //             (error: Error | null, results) => {
    //                 if (error) throw error;
    //                 else {
    //                     res.status(200).json({message: "Product id de l'utilisateur mis à jour"});
    //                 }
    //             })
    //     } catch (error) {
    //         res.status(500).json({message: "Internal server error"});
    //     }
    // }
    static async updateCustomer(req, res) {
        const body = req.body;
        const requestId = parseInt(req.params.user);
        const bodyCustomer = {
            userId: requestId,
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            phone: body.phone,
            password: body.password,
            address: body.address,
            postCode: body.post_code,
            city: body.city,
            role: 'customer'
        };
        try {
            let sql;
            let params;
            if (bodyCustomer.firstName !== '' &&
                bodyCustomer.lastName !== '' &&
                bodyCustomer.email !== '' &&
                bodyCustomer.phone !== '' &&
                bodyCustomer.city !== '' &&
                bodyCustomer.address !== '' &&
                bodyCustomer.postCode !== '' &&
                bodyCustomer.city !== '' &&
                Object.keys(body).length >= 7) {
                if (bodyCustomer.password) {
                    const hashPassword = await bcryptjs_1.default.hash(bodyCustomer.password, 10);
                    sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, password = ?, address = ?, post_code = ?, city = ? WHERE role = 'customer' AND user_id = ${requestId}`;
                    params = [
                        bodyCustomer.firstName,
                        bodyCustomer.lastName,
                        bodyCustomer.email,
                        bodyCustomer.phone,
                        hashPassword,
                        bodyCustomer.address,
                        bodyCustomer.postCode,
                        bodyCustomer.city
                    ];
                }
                else {
                    sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, post_code = ?, city = ? WHERE role = 'customer' AND user_id = ${requestId}`;
                    params = [
                        bodyCustomer.firstName,
                        bodyCustomer.lastName,
                        bodyCustomer.email,
                        bodyCustomer.phone,
                        bodyCustomer.address,
                        bodyCustomer.postCode,
                        bodyCustomer.city
                    ];
                }
                app_1.db.execute(sql, params, async (error, results) => {
                    if (error)
                        throw error;
                    else if (results.affectedRows === 0) {
                        res.status(404).send({
                            message: "L'identifiant n'existe pas ou n'a pas le bon format."
                        });
                    }
                    else {
                        res.status(201).json({
                            message: 'Utilisateur avec le rôle customer a été mis à jour !'
                        });
                    }
                });
            }
            else {
                res
                    .status(400)
                    .json({ error: 'Certains champs sont manquants ou incorrects.' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Erreur !' });
        }
    }
    static async updateProductId(req, res) {
        const userRequestId = parseInt(req.params.user);
        const productIdValue = req.body.productId;
        try {
            if ((userRequestId >= 1 && productIdValue >= 1) ||
                productIdValue === null) {
                const sql = `UPDATE users SET product_id = ? WHERE role = 'customer' AND user_id = ${userRequestId}`;
                const params = [productIdValue];
                app_1.db.execute(sql, params, (error) => {
                    if (error)
                        throw error.message;
                    else {
                        res.status(201).send({
                            message: `Produit mis à jour sur l'utilisateur n°${userRequestId}!`
                        });
                    }
                });
            }
            else {
                res
                    .status(400)
                    .json({ error: 'Certains champs sont manquants ou incorrects.' });
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Erreur !' });
        }
    }
    static async getProductIdByUserId(req, res) {
        const userRequestId = parseInt(req.params.user);
        try {
            app_1.db.query(`SELECT product_id FROM users WHERE role = 'customer' AND user_id = ${userRequestId}`, (error, results) => {
                if (error)
                    throw error;
                else if (!results) {
                    res.status(404).send({
                        message: "Id doesn't exist or doesn't have the right format"
                    });
                }
                else {
                    res.status(200).send(results[0]);
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.CustomerController = CustomerController;
function errorValues(req, res, error, newCustomer) {
    if (error.sqlMessage ===
        `Duplicate entry '${newCustomer.email}' for key 'users.email'`) {
        res.status(400);
        res.send('Cet email existe déjà !');
    }
    else if (error.sqlMessage ===
        `Duplicate entry '${newCustomer.phone}' for key 'users.phone'`) {
        res.status(400);
        res.send('Ce numéro de téléphone existe déjà !');
    }
    else {
        res.status(400);
        res.send('Erreur !');
    }
    res.end();
}
