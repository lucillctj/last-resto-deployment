"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantOwnerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const restaurantOwnerController_1 = require("../controllers/restaurantOwnerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const restaurantOwnerRoutes = () => {
    router.post('/signup', restaurantOwnerController_1.RestaurantOwnerController.createRestaurantOwnerAccount);
    // router.get('/', RestaurantOwnerController.getAllRestaurantOwners);
    router.get('/dashboard/:user', auth_1.verifyAuth, restaurantOwnerController_1.RestaurantOwnerController.getRestaurantOwnerDashboard);
    router.put('/update/:user', auth_1.verifyAuth, restaurantOwnerController_1.RestaurantOwnerController.updateRestaurantOwner);
    return router;
};
exports.restaurantOwnerRoutes = restaurantOwnerRoutes;
