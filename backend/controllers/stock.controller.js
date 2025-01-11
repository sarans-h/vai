import { errorHandler } from '../utils/error.js';
import Stock from '../models/stock.model.js';
import User from '../models/user.model.js';

// Create a new stock
export const createStock = async (req, res, next) => {
    // console.log(req.body);
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(errorHandler(404, "User not found"));
    }
    const { stockName, quantity, price, symbol } = req.body;
    if (!stockName || !quantity || !price || !symbol) {
        return next(errorHandler(400, "All fields are required"));
    }
    const cost = quantity * price;
    if (user.wallet < cost) {
        return next(errorHandler(400, "Insufficient wallet balance"));
    }
    user.wallet -= cost;
    await user.save();
    try {
        const stock = new Stock({ stockName, quantity, price, symbol, buyer: userId });
        await stock.save();
        res.status(201).json({success:true,stock});
    } catch (error) {
        // console.log(error);
        next(error);
    }
};

// Get all stocks
export const getAllStocks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const stocks = await Stock.find({ buyer: userId }).populate('buyer');
        // const stocks = await Stock.find().populate('buyer');
        res.status(200).json({ success: true, stocks });
    } catch (error) {
        next(error);
    }
};

// Get a stock by ID
export const getStockById = async (req, res, next) => {
    try {
        const stock = await Stock.findById(req.params.id).populate('buyer');
        if (!stock) {
            return next(errorHandler(404, "Stock not found"));
        }
        res.status(200).json({ success: true, stock });
    } catch (error) {
        next(error);
    }
};

// Update a stock by ID
export const updateStockById = async (req, res, next) => {
    try {
        const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!stock) {
            return next(errorHandler(404, "Stock not found"));
        }
        res.status(200).json({ success: true, stock });
    } catch (error) {
        next(error);
    }
};

// Delete a stock by ID
export const deleteStockById = async (req, res, next) => {
    try {
        const {quantity} = req.body;  
        // console.log(quantity);
        const stock = await Stock.findById(req.params.id);
        if (!stock||quantity>stock.quantity) {
            return next(errorHandler(404, "Stock not found or quantity is greater than available"));
        }
        if (quantity == stock.quantity) {
            await Stock.findByIdAndDelete(req.params.id);
        } else {
            stock.quantity -= quantity;
            await stock.save();
        }
        if (!stock) {
            return next(errorHandler(404, "Stock not found"));
        }
        const refund = stock.price * quantity;
        const user = await User.findById(stock.buyer);
        user.wallet += refund;
        await user.save();
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
