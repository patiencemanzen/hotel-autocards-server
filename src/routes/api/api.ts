import express from 'express';

import authRoutes from './AuthRoutes';
import OrganizationsRoutes from './OrganizationsRoutes';
import ProjectsRoutes from './ProjectsRoutes';
import DatabasesRoutes from './DatabasesRoutes';
import TablesRoutes from './TablesRoutes';
import DatatypesRoutes from './DatatypesRoutes';

import { authMiddleware } from '../../middlewares/AuthMiddleware';
import { bindDatabaseModels, bindOrganizationModels, bindProjectModels } from '../../middlewares/CheckModelOwnership';

const router = express.Router();

router.use(`/auth`, authRoutes);
router.use(`/organizations`, authMiddleware, OrganizationsRoutes);
router.use(`/projects/:organization`, authMiddleware, bindOrganizationModels, ProjectsRoutes);
router.use(`/databases/:project`, authMiddleware, bindProjectModels, DatabasesRoutes);
router.use(`/tables/:database`, authMiddleware, bindDatabaseModels, TablesRoutes);
router.use(`/datatypes`, authMiddleware, DatatypesRoutes);

export default router;
