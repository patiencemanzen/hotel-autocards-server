import express from 'express';
import * as DatabaseController from '../../controllers/DatabaseController';
import * as DatabaseRequest from '../../validators/DatabaseRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * DATABASES ROUTES
 * ----------------------------------------------
 */
router.get('/', DatabaseController.index);
router.get('/:id', DatabaseController.show);
router.post('/', DatabaseRequest.create, DatabaseController.store);
router.put('/:id', DatabaseRequest.update, DatabaseController.update);
router.delete('/:id', DatabaseController.destroy);

export default router;
