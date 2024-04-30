import express from 'express';

import authRoutes from './AuthRoutes';
import OrganizationsRoutes from './OrganizationsRoutes';
import ProjectsRoutes from './ProjectsRoutes';

import { authMiddleware } from '../../middlewares/AuthMiddleware';
import { checkOrganizationOwnership } from '../../middlewares/CheckOrganizationOwnership';

const router = express.Router();

router.use(`/auth`, authRoutes);
router.use(`/organizations`, authMiddleware, OrganizationsRoutes);
router.use(`/projects/:organization`, authMiddleware, checkOrganizationOwnership, ProjectsRoutes);

export default router;
