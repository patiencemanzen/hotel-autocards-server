import express from 'express';
import * as BusRoutingController from '../../controllers/BusRoutingController';

const router = express.Router();

/**
 * ----------------------------------------------
 * BUSES ROUTES
 * ----------------------------------------------
 */
router.post('/init', BusRoutingController.init);
router.get('/in-routings', BusRoutingController.getInRoutings);

export default router;
