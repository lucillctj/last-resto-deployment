"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    productId;
    name;
    description;
    price;
    userId;
    restaurantId;
    constructor(productId, name, description, price, userId, restaurantId) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.userId = userId;
        this.restaurantId = restaurantId;
    }
}
exports.Product = Product;
