"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
class Restaurant {
    restaurantId;
    name;
    description;
    address;
    postCode;
    city;
    phone;
    website;
    isAvailable;
    restaurantOwnerId;
    constructor(restaurantId, name, description, address, postCode, city, phone, website, isAvailable, restaurantOwnerId) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.description = description;
        this.address = address;
        this.postCode = postCode;
        this.city = city;
        this.phone = phone;
        this.website = website;
        this.isAvailable = isAvailable;
        this.restaurantOwnerId = restaurantOwnerId;
    }
}
exports.Restaurant = Restaurant;
