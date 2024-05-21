import express from 'express';
import * as DriverController from '../../controllers/DriverController';
import * as DriversRequest from '../../validators/DriversRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * BUSES ROUTES
 * ----------------------------------------------
 */
router.post('/', DriversRequest.create, DriverController.store);

export default router;
