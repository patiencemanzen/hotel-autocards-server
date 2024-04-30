import express from 'express';
import * as ProjectController from '../../controllers/ProjectController';
import * as ProjectRequest from '../../validators/ProjectRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * PROJECTS ROUTES
 * ----------------------------------------------
 */
router.get('/', ProjectController.index);
router.get('/:id', ProjectController.show);
router.post('/', ProjectRequest.create, ProjectController.store);
router.put('/:id', ProjectRequest.update, ProjectController.update);
router.delete('/:id', ProjectController.destroy);

export default router;
