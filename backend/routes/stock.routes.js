import express from 'express';
import { createStock, getAllStocks, getStockById, updateStockById, deleteStockById } from '../controllers/stock.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/create', verifyToken, createStock);
router.get('/all', verifyToken, getAllStocks);
router.get('/:id', verifyToken, getStockById);
router.put('/update/:id', verifyToken, updateStockById);
router.post('/delete/:id', verifyToken, deleteStockById);

export default router;
