import express from 'express';
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  bulkAddCustomers
} from '../controllers/customersController.js';

const router = express.Router();

router.post('/', addCustomer);
router.get('/:user_id', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.post('/bulk', bulkAddCustomers);

export default router;
