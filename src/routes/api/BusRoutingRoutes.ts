import express from 'express';
import * as BusRoutingController from '../../controllers/BusRoutingController';

const router = express.Router();

/**
 * ----------------------------------------------
 * BUSES ROUTES
 * ----------------------------------------------
 */
router.post('/init', BusRoutingController.init);

export default router;
