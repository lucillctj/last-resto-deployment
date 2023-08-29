"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const usersRoutes = () => {
    // router.get('/', UserController.getAllUsers);
    router.post('/login', userController_1.UserController.loginToUserAccount);
    router.post('/logout', userController_1.UserController.logoutToAccount);
    router.delete('/delete/:user', auth_1.verifyAuth, userController_1.UserController.deleteUser);
    return router;
};
exports.usersRoutes = usersRoutes;
