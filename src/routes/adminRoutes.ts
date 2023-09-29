import express from 'express';
import { AdminController } from '../controllers/adminController';

const router = express.Router();

export const adminRoutes = () => {
  router.post('/signup', AdminController.createAdminAccount);
  router.post('/login', AdminController.loginToAdminAccount);
  router.get('/dashboard/:id', AdminController.getAdminDashboard);
  router.put('/update/:id', AdminController.updateAdmin);

  return router;
};
