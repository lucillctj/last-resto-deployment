export class Restaurant {
  restaurantId?: number;
  name: string;
  description: string;
  address: string;
  postCode: string;
  city: string;
  phone: string;
  website?: string;
  isAvailable?: boolean;
  restaurantOwnerId?: number;

  constructor(
    restaurantId: number,
    name: string,
    description: string,
    address: string,
    postCode: string,
    city: string,
    phone: string,
    website: string,
    isAvailable: boolean,
    restaurantOwnerId: number
  ) {
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
