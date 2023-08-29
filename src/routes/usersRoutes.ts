import express from "express";
import {UserController} from "../controllers/userController";
import {verifyAuth} from "../middleware/auth";

const router = express.Router();

export const usersRoutes = () => {
    // router.get('/', UserController.getAllUsers);
    router.post('/login', UserController.loginToUserAccount);
    router.post('/logout', UserController.logoutToAccount);
    router.delete('/delete/:user', verifyAuth, UserController.deleteUser);

    return router;
}