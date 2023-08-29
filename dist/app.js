"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mysql2_1 = __importDefault(require("mysql2"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const customerRoutes_1 = require("./routes/customerRoutes");
const restaurantOwnerRoutes_1 = require("./routes/restaurantOwnerRoutes");
const restaurantRoutes_1 = require("./routes/restaurantRoutes");
const productRoutes_1 = require("./routes/productRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const usersRoutes_1 = require("./routes/usersRoutes");
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiLimiter);
app.use(express_1.default.static(path_1.default.join(__dirname, 'view/dist')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'view', 'dist', 'index.html'));
});
app.use((0, helmet_1.default)());
app.use('/customers', (0, customerRoutes_1.customerRoutes)());
app.use('/restaurant-owners', (0, restaurantOwnerRoutes_1.restaurantOwnerRoutes)());
app.use('/admins', (0, adminRoutes_1.adminRoutes)());
app.use('/users', (0, usersRoutes_1.usersRoutes)());
app.use('/restaurants', (0, restaurantRoutes_1.restaurantRoutes)());
app.use('/products', (0, productRoutes_1.productRoutes)());
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.db = mysql2_1.default.createConnection(process.env.DATABASE_URL ?? '');
exports.db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL database: ', error);
        return;
    }
    console.log('Connected to MySQL database :)');
});
