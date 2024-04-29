import express from 'express';
import * as OrganizationController from '../../controllers/OrganizationController';
import * as OrganizationRequest from '../../validators/OrganizationRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * ORGANIZATION ROUTES
 * ----------------------------------------------
 */
router.get('/', OrganizationController.index);
router.get('/:id', OrganizationController.show);
router.post('/', OrganizationRequest.create, OrganizationController.store);
router.put('/:id', OrganizationRequest.update, OrganizationController.update);
router.delete('/:id', OrganizationController.destroy);

export default router;
