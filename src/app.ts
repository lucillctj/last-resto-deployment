import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import mysql, { QueryError } from 'mysql2';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import { customerRoutes } from './routes/customerRoutes';
import { restaurantOwnerRoutes } from './routes/restaurantOwnerRoutes';
import { restaurantRoutes } from './routes/restaurantRoutes';
import { productRoutes } from './routes/productRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { usersRoutes } from './routes/usersRoutes';
import helmet from "helmet";

dotenv.config();

const app: Express = express();
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

const corsOptions = {
  // origin: 'https://last-resto.onrender.com',
  origin: 'http://localhost:3030',
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
app.use(express.static(process.cwd()+"/src/view/dist-angular/"));
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader(
      "Permissions-Policy",
      'geolocation=(self)'
  );
  res.setHeader('Cache-Control', 'public, max-age=3600');

  next();
});
app.use('/api/customers', customerRoutes());
app.use('/api/restaurant-owners', restaurantOwnerRoutes());
app.use('/api/admins', adminRoutes());
app.use('/api/users', usersRoutes());
app.use('/api/restaurants', restaurantRoutes());
app.use('/api/products', productRoutes());

app.get('*', (req,res) => {
    res.sendFile(process.cwd()+"/src/view/dist-angular/index.html");
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
