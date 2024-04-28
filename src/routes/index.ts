import express from 'express';
import apiRoutes from "./api/api";

const router = express.Router();

router.use('/api', apiRoutes);

export default router;
