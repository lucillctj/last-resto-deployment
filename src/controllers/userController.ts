import { Request, Response } from 'express';
import { db } from '../app';
import { QueryError, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import {
  clearTokenCookie,
  generateAccessToken,
  setTokenCookie
} from '../middleware/auth';

export class UserController {
  // public static async getAllUsers(
  //   req: Request,
  //   res: Response
  // ): Promise<[] | void> {
  //   db.query(
  //     `SELECT * FROM users`,
  //     async (error: QueryError | null, results: []) => {
  //       if (error) throw error;
  //       else if (results.length === 0) {
  //         return res
  //           .status(401)
  //           .send({ message: 'Aucun utilisateur trouvé !' });
  //       } else {
  //         return res.status(200).send({
  //           users: results
  //         });
  //       }
  //     }
  //   );
  // }

  public static async loginToUserAccount(
    req: Request,
    res: Response
  ): Promise<{ message: string; userId: number; userRole: string } | void> {
    const body = req.body;
    const bodyUser = {
      email: body.email,
      password: body.password
    };
    if (bodyUser.email !== '' && bodyUser.password !== '') {
      db.query(
        `SELECT user_id, password, role FROM users WHERE email = ?`,
        [bodyUser.email],
        async (error: QueryError | null, results: any) => {
          if (error) throw error;
          else if (results.length === 0) {
            return res
              .status(401)
              .send({ message: 'Aucun utilisateur trouvé !' });
          } else {
            const compareHashPassword = await bcrypt.compare(
              bodyUser.password,
              results[0].password
            );
            if (!compareHashPassword) {
              return res.status(401).json({ message: 'Mot de passe invalide' });
            }
            const accessToken = generateAccessToken(results[0].user_id);
            setTokenCookie(res, accessToken);

            return res.status(200).send({
              message: 'Authentification réussie',
              userId: results[0].user_id,
              userRole: results[0].role
            });
          }
        }
      );
    } else {
      res.status(400).json({ error: 'Certains champs sont manquants.' });
    }
  }

  public static async logoutToAccount(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      clearTokenCookie(res);
      res.status(200).json({ message: 'Utilisateur déconnecté' });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Une erreur s'est produite lors de la déconnexion" });
    }
  }

  public static async deleteUser(req: Request, res: Response): Promise<void> {
    const requestId = parseInt(req.params.user);
    try {
      db.execute(
        `DELETE FROM users WHERE user_id = ${requestId}`,
        (error: Error | null, results: ResultSetHeader) => {
          if (error) throw error;
          else if (results.affectedRows === 0) {
            res.status(404).send({
              message: "L'identifiant n'existe pas ou n'a pas le bon format."
            });
          } else {
            clearTokenCookie(res);
            res.status(200).send({ message: "L'utilisateur a été supprimé !" });
          }
        }
      );
    } catch (error) {
      res.status(400).json({ message: 'Internal server error' });
    }
  }
}
