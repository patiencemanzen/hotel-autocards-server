import express from 'express';

import Customers from './Customers';

const router = express.Router();

router.use(`/customers`, Customers);

export default router;
