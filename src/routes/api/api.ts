import express from 'express';

import authRoutes from './AuthRoutes';
import OrganizationsRoutes from './OrganizationsRoutes';
import { authMiddleware } from '../../middlewares/AuthMiddleware';

const router = express.Router();

router.use(`/auth`, authRoutes);
router.use(`/organizations`, authMiddleware, OrganizationsRoutes);

export default router;
