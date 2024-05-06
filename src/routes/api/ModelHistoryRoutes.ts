import express from 'express';
import * as ModelHistoryController from '../../controllers/ModelHistoryController';

const router = express.Router();

/**
 * ----------------------------------------------
 * PROJECTS ROUTES
 * ----------------------------------------------
 */
router.get('/:id', ModelHistoryController.show);
router.get('/model/:model', ModelHistoryController.index);
router.delete('/:id', ModelHistoryController.destroy);

export default router;
