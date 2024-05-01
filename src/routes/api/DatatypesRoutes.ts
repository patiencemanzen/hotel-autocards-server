import express from 'express';
import * as TableDatatypeController from '../../controllers/TableDatatypeController';
import * as TableDatatypeRequest from '../../validators/TableDatatypeRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * TABLE DATATYPE ROUTES
 * ----------------------------------------------
 */
router.get('/', TableDatatypeController.index);
router.post('/', TableDatatypeRequest.create, TableDatatypeController.store);
router.put('/:id', TableDatatypeRequest.update, TableDatatypeController.update);
router.delete('/:id', TableDatatypeController.destroy);

export default router;