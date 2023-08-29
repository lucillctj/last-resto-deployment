"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const productRoutes = () => {
    router.post('/create/user/:user', auth_1.verifyAuth, productController_1.ProductController.createProduct);
    // router.get('/', ProductController.getAllProducts);
    router.get('/restaurant/:id/user/:user', productController_1.ProductController.getProductsByRestaurantId);
    router.get('/:id/restaurant/user/:user', auth_1.verifyAuth, productController_1.ProductController.getRestaurantIdByProductId);
    router.get('/:id/user/:user', auth_1.verifyAuth, productController_1.ProductController.getProductById);
    // router.put('/update/:id/user/:user', verifyAuth, ProductController.updateProduct);
    router.delete('/delete/:id/user/:user', auth_1.verifyAuth, productController_1.ProductController.deleteProduct);
    return router;
};
exports.productRoutes = productRoutes;
