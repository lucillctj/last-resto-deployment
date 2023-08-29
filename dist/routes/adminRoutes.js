"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
const adminRoutes = () => {
    router.post('/signup', adminController_1.AdminController.createAdminAccount);
    router.post('/login', adminController_1.AdminController.loginToAdminAccount);
    router.get('/', adminController_1.AdminController.getAllAdmins);
    router.get('/dashboard/:id', adminController_1.AdminController.getAdminDashboard);
    router.put('/update/:id', adminController_1.AdminController.updateAdmin);
    // router.delete('/delete/:id', AdminController.deleteAdmin);
    return router;
};
exports.adminRoutes = adminRoutes;
