"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const app_1 = require("../app");
class RestaurantController {
    static async createRestaurant(req, res) {
        const body = req.body;
        const requestId = parseInt(req.params.user);
        const restaurant = {
            name: body.name,
            description: body.description,
            address: body.address,
            postCode: body.post_code,
            city: body.city,
            phone: body.phone,
            website: body.website || null,
            isAvailable: body.is_available,
            restaurantOwnerId: requestId
        };
        try {
            if (restaurant.name !== '' &&
                restaurant.description !== '' &&
                restaurant.address !== '' &&
                restaurant.postCode !== '' &&
                restaurant.city !== '' &&
                restaurant.phone !== '' &&
                restaurant.restaurantOwnerId >= 1 &&
                (Object.keys(body).length === 7 || 8)) {
                const sql = `INSERT INTO restaurants (name, description, address, post_code, city, phone, website, is_available, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const params = [
                    restaurant.name,
                    restaurant.description,
                    restaurant.address,
                    restaurant.postCode,
                    restaurant.city,
                    restaurant.phone,
                    restaurant.website,
                    false,
                    restaurant.restaurantOwnerId
                ];
                app_1.db.execute(sql, params, async (error) => {
                    if (error)
                        throw error;
                    else {
                        res
                            .status(201)
                            .send({ message: `Restaurant ${restaurant.name} was created!` });
                    }
                });
            }
            else {
                res.status(400).json({ error: 'Missing or incorrect values' });
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Missing values' });
        }
    }
    static async getAllRestaurants(req, res) {
        try {
            app_1.db.query(`SELECT * FROM restaurants`, (error, results) => {
                return res.status(200).send({ results });
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getRestaurantByUserId(req, res) {
        const userRequestId = parseInt(req.params.user);
        try {
            app_1.db.query(`SELECT * FROM restaurants WHERE user_id =${userRequestId}`, (error, results) => {
                return res.status(200).send(results);
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getRestaurantDashboard(req, res) {
        const requestId = parseInt(req.params.id);
        try {
            app_1.db.query(`SELECT * FROM restaurants WHERE restaurant_id = ${requestId}`, (error, results) => {
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
    static async updateRestaurant(req, res) {
        const body = req.body;
        const restaurantRequestId = parseInt(req.params.id);
        const requestUserId = parseInt(req.params.user);
        const bodyRestaurant = {
            restaurantId: body.restaurant_id,
            name: body.name,
            description: body.description,
            address: body.address,
            postCode: body.post_code,
            city: body.city,
            phone: body.phone,
            website: body.website,
            restaurantOwnerId: requestUserId
        };
        try {
            if (bodyRestaurant.name !== '' &&
                bodyRestaurant.description !== '' &&
                bodyRestaurant.address !== '' &&
                bodyRestaurant.postCode !== '' &&
                bodyRestaurant.city !== '' &&
                bodyRestaurant.phone !== '' &&
                Object.keys(body).length >= 6) {
                const sql = `UPDATE restaurants SET name = ?, description = ?, address = ?, post_code = ?, city = ?, phone = ?, website = ?, user_id = ? WHERE restaurant_id = ${restaurantRequestId}`;
                const params = [
                    bodyRestaurant.name,
                    bodyRestaurant.description,
                    bodyRestaurant.address,
                    bodyRestaurant.postCode,
                    bodyRestaurant.city,
                    bodyRestaurant.phone,
                    bodyRestaurant.website,
                    bodyRestaurant.restaurantOwnerId
                ];
                app_1.db.execute(sql, params, async (error, results) => {
                    if (error)
                        throw error;
                    else if (results.affectedRows === 0) {
                        res.status(404).send({
                            message: "Restaurant id doesn't exist or doesn't have the right format"
                        });
                    }
                    else {
                        res.status(201).send({
                            message: `Restaurant ${bodyRestaurant.name} was updated!`
                        });
                    }
                });
            }
            else {
                res.status(400).json({ error: 'Missing or incorrect values' });
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Erreur !' });
        }
    }
    static async updateAvailability(req, res) {
        const restaurantRequestId = parseInt(req.params.id);
        const isAvailable = req.body.isAvailable;
        try {
            if (typeof isAvailable !== undefined && isAvailable !== null) {
                const sql = `UPDATE restaurants SET is_available = ? WHERE restaurant_id = ${restaurantRequestId}`;
                const params = [isAvailable];
                app_1.db.execute(sql, params, async (error, results) => {
                    if (error)
                        throw error;
                    else if (results.affectedRows === 0) {
                        res.status(404).send({
                            message: "Restaurant id doesn't exist or doesn't have the right format"
                        });
                    }
                    else {
                        res
                            .status(201)
                            .send({ message: `Restaurant availability was updated!` });
                    }
                });
            }
            else {
                res.status(400).json({ error: 'Missing or incorrect values' });
            }
        }
        catch (error) {
            res.status(400).json({ error: 'Error' });
        }
    }
    static async deleteRestaurant(req, res) {
        const requestId = parseInt(req.params.id);
        try {
            app_1.db.execute(`DELETE FROM restaurants WHERE restaurant_id = ${requestId}`, (error, results) => {
                if (error)
                    throw error;
                else if (results.affectedRows === 0) {
                    res.status(404).send({
                        message: "Restaurant id doesn't exist or doesn't have the right format"
                    });
                }
                else {
                    res
                        .status(200)
                        .send({ message: `Restaurant ${requestId} was deleted!` });
                }
            });
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}
exports.RestaurantController = RestaurantController;
