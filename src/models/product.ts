export class Product {
  productId?: number;
  name: string;
  description: string;
  price: number;
  restaurantId: number;

  constructor(
    productId: number,
    name: string,
    description: string,
    price: number,
    restaurantId: number
  ) {
    this.productId = productId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.restaurantId = restaurantId;
  }
}
