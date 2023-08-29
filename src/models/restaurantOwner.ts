export class RestaurantOwner {
    userId?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'restaurant owner';
    restaurantId?: number;

    constructor(userId: number, firstName: string, lastName: string, email: string, phone: string, password: string, role: 'restaurant owner', address: string, postCode: string, city: string, restaurantId: number) {
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
