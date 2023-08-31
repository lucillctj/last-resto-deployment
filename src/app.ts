import express, {Express} from 'express';
import cookieParser from 'cookie-parser';
import mysql, {QueryError} from 'mysql2';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import {customerRoutes} from "./routes/customerRoutes";
import {restaurantOwnerRoutes} from "./routes/restaurantOwnerRoutes";
import {restaurantRoutes} from "./routes/restaurantRoutes";
import {productRoutes} from "./routes/productRoutes";
import {adminRoutes} from "./routes/adminRoutes";
import {usersRoutes} from "./routes/usersRoutes";
// import helmet from "helmet";

dotenv.config();

const app: Express = express();
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

const corsOptions = {
    origin: 'https://last-resto-web-service.onrender.com',
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(apiLimiter);

app.use(express.static(process.cwd()+"/dist/view/dist/"));
// app.use(helmet());

app.use('/customers', customerRoutes());
app.use('/restaurant-owners', restaurantOwnerRoutes());
app.use('/admins', adminRoutes());
app.use('/users', usersRoutes());
app.use('/restaurants', restaurantRoutes());
app.use('/products', productRoutes());

app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/dist/view/dist/index.html");
    // res.sendFile(path.resolve("dist/view/dist/index.html"))
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export const db = mysql.createConnection(process.env.DATABASE_URL ?? '');

db.connect((error: QueryError | null) => {
    if (error) {
        console.error('Error connecting to MySQL database: ', error);
        return;
    }
    console.log('Connected to MySQL database :)');
});