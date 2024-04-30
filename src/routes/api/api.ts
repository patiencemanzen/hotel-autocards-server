import express from 'express';

import authRoutes from './AuthRoutes';
import OrganizationsRoutes from './OrganizationsRoutes';
import ProjectsRoutes from './ProjectsRoutes';
import DatabasesRoutes from './DatabasesRoutes';

import { authMiddleware } from '../../middlewares/AuthMiddleware';
import { checkOrganizationOwnership, checkProjectOwnership } from '../../middlewares/CheckModelOwnership';

const router = express.Router();

router.use(`/auth`, authRoutes);
router.use(`/organizations`, authMiddleware, OrganizationsRoutes);
router.use(`/projects/:organization`, authMiddleware, checkOrganizationOwnership, ProjectsRoutes);
router.use(`/databases/:project`, authMiddleware, checkProjectOwnership, DatabasesRoutes);

export default router;
