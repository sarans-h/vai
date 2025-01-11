import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    stockName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    dateBought: {
        type: Date,
        default: Date.now
    }
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
