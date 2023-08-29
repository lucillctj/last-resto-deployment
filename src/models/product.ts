export class Product {
    productId?: number;
    name: string;
    description: string;
    price: number;
    userId?: number;
    restaurantId: number;

    constructor(productId: number, name: string, description: string, price: number, userId: number, restaurantId: number) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.userId = userId;
        this.restaurantId = restaurantId;
    }
}