import express from 'express';
import { syncUser } from '../controllers/usersController.js';

const router = express.Router();
router.post('/', syncUser);

export default router;
