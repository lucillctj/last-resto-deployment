import { Request, Response } from 'express';
import { db } from '../app';
import { RestaurantOwner } from '../models/restaurantOwner';
import { QueryError } from 'mysql2';
import bcrypt from 'bcryptjs';
import { generateAccessToken, setTokenCookie } from '../middleware/auth';

export class RestaurantOwnerController {
  public static async createRestaurantOwnerAccount(
    req: Request,
    res: Response
  ): Promise<void> {
    const body = req.body;
    const bodyRestaurantOwner: RestaurantOwner = {
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: 'restaurant owner'
    };
    const hashPassword = await bcrypt.hash(bodyRestaurantOwner.password, 10);

    try {
      if (
        bodyRestaurantOwner.firstName !== '' &&
        bodyRestaurantOwner.lastName !== '' &&
        bodyRestaurantOwner.email !== '' &&
        bodyRestaurantOwner.phone !== '' &&
        bodyRestaurantOwner.password !== '' &&
        Object.keys(body).length === 5
      ) {
        const sql = `INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [
          bodyRestaurantOwner.firstName,
          bodyRestaurantOwner.lastName,
          bodyRestaurantOwner.email,
          bodyRestaurantOwner.phone,
          hashPassword,
          'restaurant owner'
        ];
        db.execute(
          sql,
          params,
          async (error: QueryError | null, results: any) => {
            if (error) {
              await errorValues(req, res, error, bodyRestaurantOwner);
            } else {
              const accessToken = generateAccessToken(results.insertId);
              setTokenCookie(res, accessToken);
              res.status(201).send({
                message: `Utilisateur avec le rôle 'restaurant owner' a été créé !`,
                userId: results.insertId,
                accessToken
              });
            }
          }
        );
      } else {
        res
          .status(400)
          .json({ error: 'Certains champs sont manquants ou incorrects.' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Erreur !' });
    }
  }

  // public static async getAllRestaurantOwners(req: Request, res: Response): Promise<void> {
  //     try {
  //         db.query(
  //             `SELECT * FROM users WHERE role = 'restaurant owner'`,
  //             (error: Error | null, results: ResultSetHeader) => {
  //                 return res.status(200).send(results);
  //             })
  //     } catch (error) {
  //         res.status(500).json({message: "Internal server error"});
  //     }
  // }

  public static async getRestaurantOwnerDashboard(
    req: Request,
    res: Response
  ): Promise<void> {
    const requestId = parseInt(req.params.user);
    try {
      db.query(
        `SELECT * FROM users WHERE role = 'restaurant owner' AND user_id = ${requestId}`,
        (error: Error | null, results: RestaurantOwner[]) => {
          if (error) throw error;
          else if (results.length === 0) {
            res
              .status(404)
              .send("L'identifiant n'existe pas ou n'a pas le bon format.");
          } else {
            res.status(200).send(results[0]);
          }
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async updateRestaurantOwner(
    req: Request,
    res: Response
  ): Promise<void> {
    const body = req.body;
    const requestId = parseInt(req.params.user);
    const bodyRestaurantOwner: RestaurantOwner = {
      userId: requestId,
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: 'restaurant owner'
    };

    try {
      let sql;
      let params;

      if (
        bodyRestaurantOwner.firstName !== '' &&
        bodyRestaurantOwner.lastName !== '' &&
        bodyRestaurantOwner.email !== '' &&
        bodyRestaurantOwner.phone !== '' &&
        Object.keys(body).length >= 4
      ) {
        if (bodyRestaurantOwner.password) {
          const hashPassword = await bcrypt.hash(
            bodyRestaurantOwner.password,
            10
          );
          sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, password = ? WHERE role = 'restaurant owner' AND user_id = ${requestId}`;
          params = [
            bodyRestaurantOwner.firstName,
            bodyRestaurantOwner.lastName,
            bodyRestaurantOwner.email,
            bodyRestaurantOwner.phone,
            hashPassword
          ];
        } else {
          sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE role = 'restaurant owner' AND user_id = ${requestId}`;
          params = [
            bodyRestaurantOwner.firstName,
            bodyRestaurantOwner.lastName,
            bodyRestaurantOwner.email,
            bodyRestaurantOwner.phone
          ];
        }

        db.execute(
          sql,
          params,
          async (error: QueryError | null, results: any) => {
            if (error) throw error;
            else if (results.affectedRows === 0) {
              res.status(404).send({
                message: "L'identifiant n'existe pas ou n'a pas le bon format."
              });
            } else {
              res.status(201).send({
                message: `Utilisateur avec le rôle 'restaurant owner' a été mis à jour !`
              });
            }
          }
        );
      } else {
        res
          .status(400)
          .json({ error: 'Certains champs sont manquants ou incorrects.' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Erreur !' });
    }
  }
}

function errorValues(
  req: Request,
  res: Response,
  error: any,
  newRestaurantOwner: RestaurantOwner
): any {
  if (
    error.sqlMessage ===
    `Duplicate entry '${newRestaurantOwner.email}' for key 'users.email'`
  ) {
    res.status(400);
    res.send('Cet email existe déjà !');
  } else if (
    error.sqlMessage ===
    `Duplicate entry '${newRestaurantOwner.phone}' for key 'users.phone'`
  ) {
    res.status(400);
    res.send('Ce numéro de téléphone existe déjà !');
  } else {
    res.status(400);
    res.send('Erreur !');
  }
  res.end();
}
