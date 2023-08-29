import express from "express";
import { CustomerController } from "../controllers/customerController";
import {verifyAuth} from "../middleware/auth";

const router = express.Router();

export const customerRoutes = () => {
    router.post('/signup', CustomerController.createCustomerAccount);
    router.get('/dashboard/:user', verifyAuth, CustomerController.getCustomerDashboard);
    router.get('/data/customer/:customer/:user', verifyAuth, CustomerController.getDataCustomer);
    router.get('/:id/get-user/user/:user', verifyAuth, CustomerController.getUserIdByProductId);
    router.put('/update/:user', verifyAuth, CustomerController.updateCustomer);
    router.put('/update-product-id/:user', CustomerController.updateProductId)
    router.get('/:user/product', verifyAuth, CustomerController.getProductIdByUserId)

    return router;
}