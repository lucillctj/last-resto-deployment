export class Customer {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  postCode: string;
  city: string;
  productId?: number;
  role: 'customer';

  constructor(
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    role: 'customer',
    address: string,
    postCode: string,
    city: string,
    productId: number
  ) {
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
