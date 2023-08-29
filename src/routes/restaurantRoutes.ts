import express from "express";
import {RestaurantController} from "../controllers/restaurantController";
import {verifyAuth} from "../middleware/auth";

const router = express.Router();

export const restaurantRoutes = () => {
    router.post('/create/:user', verifyAuth, RestaurantController.createRestaurant);
    router.get('/', RestaurantController.getAllRestaurants);
    router.get('/user/:user', verifyAuth, RestaurantController.getRestaurantByUserId);
    router.get('/dashboard/:id/user/:user', verifyAuth, RestaurantController.getRestaurantDashboard);
    router.put('/update/:id/user/:user', verifyAuth, RestaurantController.updateRestaurant);
    router.put('/update-availability/:id/user/:user', verifyAuth, RestaurantController.updateAvailability);
    router.delete('/delete/:id/user/:user', verifyAuth, RestaurantController.deleteRestaurant);

    return router;
}