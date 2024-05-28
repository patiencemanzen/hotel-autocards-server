import express from 'express';
import * as BusesController from '../../controllers/BusesController';
import * as BusesRequest from '../../validators/BusesRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * BUSES ROUTES
 * ----------------------------------------------
 */
router.post('/', BusesRequest.create, BusesController.store);
router.post('/assign-routes/:bus', BusesController.assignRoutes);

export default router;
