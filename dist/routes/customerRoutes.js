"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const customerRoutes = () => {
    router.post('/signup', customerController_1.CustomerController.createCustomerAccount);
    router.get('/dashboard/:user', auth_1.verifyAuth, customerController_1.CustomerController.getCustomerDashboard);
    router.get('/data/customer/:customer/:user', auth_1.verifyAuth, customerController_1.CustomerController.getDataCustomer);
    router.get('/:id/get-user/user/:user', auth_1.verifyAuth, customerController_1.CustomerController.getUserIdByProductId);
    router.put('/update/:user', auth_1.verifyAuth, customerController_1.CustomerController.updateCustomer);
    router.put('/update-product-id/:user', auth_1.verifyAuth, customerController_1.CustomerController.updateProductId);
    router.get('/:user/product', auth_1.verifyAuth, customerController_1.CustomerController.getProductIdByUserId);
    return router;
};
exports.customerRoutes = customerRoutes;
