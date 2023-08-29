"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const restaurantController_1 = require("../controllers/restaurantController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const restaurantRoutes = () => {
    router.post('/create/:user', auth_1.verifyAuth, restaurantController_1.RestaurantController.createRestaurant);
    router.get('/', restaurantController_1.RestaurantController.getAllRestaurants);
    router.get('/user/:user', auth_1.verifyAuth, restaurantController_1.RestaurantController.getRestaurantByUserId);
    router.get('/dashboard/:id/user/:user', auth_1.verifyAuth, restaurantController_1.RestaurantController.getRestaurantDashboard);
    router.put('/update/:id/user/:user', auth_1.verifyAuth, restaurantController_1.RestaurantController.updateRestaurant);
    router.put('/update-availability/:id/user/:user', auth_1.verifyAuth, restaurantController_1.RestaurantController.updateAvailability);
    router.delete('/delete/:id/user/:user', auth_1.verifyAuth, restaurantController_1.RestaurantController.deleteRestaurant);
    return router;
};
exports.restaurantRoutes = restaurantRoutes;
