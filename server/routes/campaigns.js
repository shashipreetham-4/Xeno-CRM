import express from 'express';
import { launchCampaign, deliveryReceiptHandler, getCampaignHistory } from '../controllers/campaignsController.js';

const router = express.Router();

router.post('/', launchCampaign); // POST /api/campaigns
router.post('/delivery-receipt', deliveryReceiptHandler); // POST /api/campaigns/delivery-receipt
router.get('/user/:user_id', getCampaignHistory);

export default router;
