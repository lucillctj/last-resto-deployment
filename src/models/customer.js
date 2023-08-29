"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
class Customer {
    userId;
    firstName;
    lastName;
    email;
    phone;
    password;
    address;
    postCode;
    city;
    productId;
    role;
    constructor(userId, firstName, lastName, email, phone, password, role, address, postCode, city, productId) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.address = address;
        this.postCode = postCode;
        this.city = city;
        this.productId = productId;
    }
}
exports.Customer = Customer;
