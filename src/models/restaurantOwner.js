"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantOwner = void 0;
class RestaurantOwner {
    userId;
    firstName;
    lastName;
    email;
    phone;
    password;
    role;
    restaurantId;
    constructor(userId, firstName, lastName, email, phone, password, role, address, postCode, city, restaurantId) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.restaurantId = restaurantId;
    }
}
exports.RestaurantOwner = RestaurantOwner;
