import express from 'express';
import { previewSegment, saveSegment } from '../controllers/segmentsController.js';
import { getSegmentsByUser } from '../controllers/segmentsController.js';

const router = express.Router();

router.post('/preview', previewSegment);
router.post('/', saveSegment);
router.get('/user/:user_id', getSegmentsByUser);

export default router;
