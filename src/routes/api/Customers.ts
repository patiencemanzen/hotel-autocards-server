import express from 'express';
import * as customerController from '../../controllers/CustomersController';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * ----------------------------------------------
 * USER LOCAL AUTH ROUTES
 * ----------------------------------------------
 */
router.get('/', customerController.index);
router.get('/single/:id', customerController.showCustomer);
router.post('/register', customerController.register);

router.get('/cards', customerController.getCards);
router.get('/cards/:id', customerController.showCard);
router.post('/cards', customerController.postCards);
router.post('/cards/assign', customerController.assignCard)

export default router;
