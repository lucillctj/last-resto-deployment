import {Request, Response} from "express";
import {db} from "../app";
import {QueryError, ResultSetHeader} from "mysql2";
import {Product} from "../models/product";
import {Restaurant} from "../models/restaurant";
import {Customer} from "../models/customer";

export class ProductController {
    // public static async getAllProducts(req: Request, res: Response): Promise<void> {
    //     try {
    //         db.query(
    //             `SELECT * FROM products`,
    //             (error: Error | null, results: ResultSetHeader) => {
    //                 return res.status(200).send(results);
    //             })
    //     } catch (error) {
    //         res.status(500).json({message: "Internal server error"});
    //     }
    // }

    public static async getProductsByRestaurantId(req: Request, res: Response): Promise<Product[] | any> {
        const restaurantRequestId = parseInt(req.params.id);
        try {
            db.query(
                `SELECT * FROM products WHERE restaurant_id = ${restaurantRequestId}`,
                (error: Error | null, results: Product[]) => {
                    return res.status(200).send(results);
                })
        } catch (error) {
            res.status(500).json({message: "Internal server error"});
        }
    }

    public static async getRestaurantIdByProductId(req: Request, res: Response): Promise<any> {
        const productRequestId = parseInt(req.params.id);
        try {
            db.query(
                `SELECT restaurant_id FROM products WHERE product_id = ${productRequestId}`,
                (error: Error | null, results: Restaurant[]) => {
                    return res.status(200).send(results[0]);
                })
        } catch (error) {
            res.status(500).json({message: "Internal server error"});
        }
    }

    public static async getProductById(req: Request, res: Response): Promise<void> {
        const requestId = parseInt(req.params.id);
        try {
            db.query(
                `SELECT * FROM products WHERE product_id = ${requestId}`,
                (error: Error | null, results: Product[]) => {
                    if (error) throw error;
                    else if (!results) {
                        res.status(404).send({message: "Id doesn't exist or doesn't have the right format"});
                    } else {
                        res.status(200).send(results[0]);
                    }
                })
        } catch (error) {
            res.status(500).json({message: "Internal server error"});
        }
    }

    public static async createProduct(req: Request, res: Response): Promise<void> {
        const body = req.body;
        const product: Product = {
            name: body.name,
            description: body.description,
            price: body.price,
            restaurantId: body.restaurant_id
        };
        try {
            if (product.name !== '' && product.description !== '' && product.price >1 && product.restaurantId >=1 && Object.keys(body).length === 4) {
                const sql = `INSERT INTO products (name, description, price, restaurant_id) VALUES (?, ?, ?, ?)`;
                const params = [product.name, product.description, product.price, product.restaurantId];
                db.execute(sql, params, async (error: QueryError | null) => {
                    if (error) throw error;
                    else {
                        res.status(201).send({message: `Product ${product.name} was created!`});
                    }
                })
            } else {
                res.status(400).json({error: 'Missing or incorrect values'});
            }
        } catch (error) {
            res.status(400).json({error: 'Missing values'});
        }
    }

    // public static async updateProduct(req: Request, res: Response): Promise<void> {
    //     const body = req.body;
    //     const requestId = parseInt(req.params.id);
    //     const product: Product = {
    //         productId: body.product_id,
    //         name: body.name,
    //         description: body.description,
    //         price: body.price,
    //         userId: body.user_id,
    //         restaurantId: body.restaurant_id
    //     };
    //     try {
    //         if (product.name !== '' && product.description !== '' && product.price >1 && product.userId! >=1 && product.restaurantId >=1 && Object.keys(body).length === 4) {
    //             const sql = `UPDATE products SET name = ?, description = ?, price = ?, user_id = ?, restaurant_id = ? WHERE product_id = ${requestId}`;
    //             const params = [product.name, product.description, product.price, product.restaurantId];
    //             db.execute(sql, params, async (error: QueryError | null, results: any) => {
    //                 if (error) throw error;
    //                 else if (results.affectedRows === 0) {
    //                     res.status(404).send({message: "Product id doesn't exist or doesn't have the right format"});
    //                 } else {
    //                     res.status(201).send({message: `Product ${product.name} was updated!`});
    //                 }
    //             })
    //         } else {
    //             res.status(400).json({error: 'Missing or incorrect values'});
    //         }
    //     } catch (error) {
    //         res.status(400).json({error: 'Missing values'});
    //     }
    // }


    public static async deleteProduct(req: Request, res: Response): Promise<void> {
        const requestId = parseInt(req.params.id);
        try {
            db.execute(
                `DELETE FROM products WHERE product_id = ${requestId}`, (error: Error | null, results: ResultSetHeader) => {
                    if (error) throw error;

                    else if (results.affectedRows === 0) {
                        res.status(404).send({message: "Product doesn't exist or doesn't have the right format"});
                    } else {
                        res.status(200).send({message: 'Product deleted!'});
                    }
                })
        } catch (error) {
            res.status(500).json({message: "Internal server error"});
        }
    }
}