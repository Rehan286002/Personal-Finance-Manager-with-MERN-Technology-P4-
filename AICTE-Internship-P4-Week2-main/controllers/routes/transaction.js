import express from 'express';
import { createTransaction, getTransactions, deleteTransaction, bulkDeleteTransactions, getTransactionById } from '../controllers/transactionController.js';
import { body, validationResult } from 'express-validator';
import {authenticateToken} from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/', authenticateToken, [
    body('amount').isNumeric(),
    body('description').isString().notEmpty(),
    body('type').isIn(['income', 'expense']),
    body('date').isISO8601().toDate()
], createTransaction);

router.get('/', authenticateToken, getTransactions);
router.delete('/:id', authenticateToken, deleteTransaction);
router.delete('/bulk', authenticateToken, bulkDeleteTransactions);
router.get('/:id', authenticateToken, getTransactionById);

export default router;