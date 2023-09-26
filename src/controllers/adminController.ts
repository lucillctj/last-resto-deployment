import { Request, Response } from 'express';
import { db } from '../app';
import { Admin } from '../models/admin';
import { QueryError, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../middleware/auth';

export class AdminController {
  public static async createAdminAccount(
    req: Request,
    res: Response
  ): Promise<void> {
    const body = req.body;
    const bodyAdmin: Admin = {
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: 'admin'
    };
    const hashPassword = await bcrypt.hash(bodyAdmin.password, 10);

    try {
      if (
        bodyAdmin.firstName !== '' &&
        bodyAdmin.lastName !== '' &&
        bodyAdmin.email !== '' &&
        bodyAdmin.phone !== '' &&
        bodyAdmin.password !== '' &&
        Object.keys(body).length === 5
      ) {
        const sql = `INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [
          bodyAdmin.firstName,
          bodyAdmin.lastName,
          bodyAdmin.email,
          bodyAdmin.phone,
          hashPassword,
          'admin'
        ];
        db.execute(
          sql,
          params,
          async (error: QueryError | null, results: any) => {
            if (error) {
              await errorValues(req, res, error, bodyAdmin);
            } else {
              const accessToken = generateAccessToken(results.insertId);
              res.status(201).send({
                message: `Utilisateur avec le rôle 'admin' a été créé !`,
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

  public static async loginToAdminAccount(
    req: Request,
    res: Response
  ): Promise<void> {
    const body = req.body;
    const bodyAdmin: Admin = {
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: 'admin'
    };
    if (
      bodyAdmin.email !== '' &&
      bodyAdmin.password !== '' &&
      Object.keys(body).length === 2
    ) {
      db.query(
        `SELECT * FROM users WHERE role = 'admin' AND email = ?`,
        [bodyAdmin.email],
        async (error: QueryError | null, results: any) => {
          if (error) throw error;
          else if (results.length === 0) {
            return res.status(401).send({
              message: 'Aucun utilisateur trouvé !',
              accessToken: null
            });
          } else {
            const compareHashPassword = await bcrypt.compare(
              bodyAdmin.password,
              results[0].password
            );
            if (!compareHashPassword) {
              return res.status(401).json({ message: 'Mot de passe invalide' });
            }
            const accessToken = generateAccessToken(results.insertId);

            return res.status(200).send({
              message: 'Authentification réussie',
              accessToken
            });
          }
        }
      );
    } else {
      res.status(400).json({ error: 'Certains champs sont manquants.' });
    }
  }

  public static async getAllAdmins(req: Request, res: Response): Promise<void> {
    try {
      db.query(
        `SELECT * FROM users WHERE role = 'admin'`,
        (error: Error | null, results: ResultSetHeader) => {
          return res.status(200).send(results);
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async getAdminDashboard(
    req: Request,
    res: Response
  ): Promise<void> {
    const requestId = parseInt(req.params.id);
    try {
      db.query(
        `SELECT * FROM users WHERE role = 'admin' AND user_id = ${requestId}`,
        (error: Error | null, results: any) => {
          if (error) throw error;
          else if (results.length === 0) {
            res.status(404).send({
              message: "L'identifiant n'existe pas ou n'a pas le bon format."
            });
          } else {
            res.status(200).send(results);
          }
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async updateAdmin(req: Request, res: Response): Promise<void> {
    const body = req.body;
    const requestId = parseInt(req.params.id);
    const bodyAdmin: Admin = {
      userId: requestId,
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: 'admin'
    };
    try {
      if (
        bodyAdmin.firstName !== '' &&
        bodyAdmin.lastName !== '' &&
        bodyAdmin.email !== '' &&
        bodyAdmin.phone !== '' &&
        bodyAdmin.password !== '' &&
        Object.keys(body).length === 5
      ) {
        const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, password = ? WHERE role = 'admin' AND user_id = ${requestId}`;
        const params = [
          bodyAdmin.firstName,
          bodyAdmin.lastName,
          bodyAdmin.email,
          bodyAdmin.phone,
          bodyAdmin.password
        ];
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
                message: `Utilisateur avec le rôle 'admin' a été mis à jour !`
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

  public static async deleteAdmin(req: Request, res: Response): Promise<void> {
    const requestId = parseInt(req.params.id);
    try {
      db.execute(
        `DELETE FROM users WHERE role = 'admin' AND user_id = ${requestId}`,
        (error: Error | null, results: ResultSetHeader) => {
          if (error) throw error;
          else if (results.affectedRows === 0) {
            res.status(404).send({
              message: "L'identifiant n'existe pas ou n'a pas le bon format."
            });
          } else {
            res.status(200).send({ message: "L'utilisateur a été supprimé !" });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

function errorValues(
  req: Request,
  res: Response,
  error: any,
  newAdmin: Admin
): any {
  if (
    error.sqlMessage.includes(
      `Duplicate entry '${newAdmin.email}' for key 'users.email'`
    )
  ) {
    res.status(400);
    res.send('Cet email existe déjà !');
  } else if (
    error.sqlMessage.includes(
      `Duplicate entry '${newAdmin.phone}' for key 'users.phone'`
    )
  ) {
    res.status(400);
    res.send('Ce numéro de téléphone existe déjà !');
  } else {
    res.status(400);
    res.send('Erreur !');
  }
  res.end();
}
