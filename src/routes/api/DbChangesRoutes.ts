import express from 'express';
import * as DbfileChanges from '../../controllers/DbfileChangesController';
import * as MergeFilesRequest from '../../validators/MergeFilesRequest';

const router = express.Router();

/**
 * ----------------------------------------------
 * MERGE ROUTES
 * ----------------------------------------------
 */
router.post('/', MergeFilesRequest.create, DbfileChanges.merge);

export default router;
