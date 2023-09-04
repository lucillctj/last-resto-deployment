import express from 'express';
import { ProductController } from '../controllers/productController';
import { verifyAuth } from '../middleware/auth';

const router = express.Router();

export const productRoutes = () => {
  router.post(
    '/create/user/:user',
    verifyAuth,
    ProductController.createProduct
  );
  // router.get('/', ProductController.getAllProducts);
  router.get(
    '/restaurant/:id/user/:user',
    ProductController.getProductsByRestaurantId
  );
  router.get(
    '/:id/restaurant/user/:user',
    verifyAuth,
    ProductController.getRestaurantIdByProductId
  );
  router.get('/:id/user/:user', verifyAuth, ProductController.getProductById);
  // router.put('/update/:id/user/:user', verifyAuth, ProductController.updateProduct);
  router.delete(
    '/delete/:id/user/:user',
    verifyAuth,
    ProductController.deleteProduct
  );

  return router;
};
