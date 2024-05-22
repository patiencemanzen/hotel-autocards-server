import express from 'express';

import authRoutes from './AuthRoutes';
import busRoutingRoutes from './BusRoutingRoutes';
import busesRoutes from './BusesRoutes';
import driversRoutes from './DriversRoutes';

const router = express.Router();

router.use(`/auth`, authRoutes);
router.use(`/drivers`, driversRoutes);
router.use(`/buses`, busesRoutes);
router.use(`/busroutes`, busRoutingRoutes);

export default router;
