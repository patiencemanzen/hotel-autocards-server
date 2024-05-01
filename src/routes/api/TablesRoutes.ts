import express from 'express';
import * as TableController from '../../controllers/TableController';
import * as TableColumnController from '../../controllers/TableColumnController';
import * as TableRelationshipController from '../../controllers/TableRelationshipController';
import * as TableRequest from '../../validators/TableRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * TABLES ROUTES
 * ----------------------------------------------
 */
router.get('/', TableController.index);
router.get('/:id', TableController.show);
router.post('/', TableRequest.create, TableController.store);
router.put('/:id', TableRequest.update, TableController.update);
router.delete('/:id', TableController.destroy);

/**
 * ----------------------------------------------
 * TABLES COLUMNS ROUTES
 * ----------------------------------------------
 */
router.get('/:table_id/columns', TableRequest.createTableColumns, TableColumnController.index);
router.get('/:table_id/columns/:id', TableRequest.createTableColumns, TableColumnController.show);
router.post('/:table_id/columns', TableRequest.createTableColumns, TableColumnController.store);
router.put('/:table_id/columns', TableRequest.updateTableColumns, TableColumnController.update);
router.delete('/:table_id/columns', TableRequest.deleteTableColumns, TableColumnController.destroy);

/**
 * ----------------------------------------------
 * TABLES RELATIONSHIP ROUTES
 * ----------------------------------------------
 */
router.post('/relationships', TableRequest.createTableRelation, TableRelationshipController.store);
router.put('/relationships/:relation_id', TableRequest.updateTableRelation, TableRelationshipController.update);
router.delete('/relationships/:relation_id', TableRelationshipController.destroy);

export default router;
