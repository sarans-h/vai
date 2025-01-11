import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStocks } from '../features/stockSlice';
import axios from 'axios';

function LeftProfile() {
    const dispatch = useDispatch();
    const { stocks, sLoading, sError } = useSelector((state) => state.stock);
    const [livePrices, setLivePrices] = useState({});

    useEffect(() => {
        dispatch(getStocks());
    }, [dispatch]);

    useEffect(() => {
        const fetchLivePrices = async () => {
            if (!stocks) return;
            
            const prices = {};
            console.log(stocks);
            for (const stock of stocks?.stocks) {
                try {
                    const response = await axios.get(
                        `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=ctrs3shr01qhb16nl920ctrs3shr01qhb16nl92g`
                    );
                    prices[stock.symbol] = response.data.c; // Current price
                } catch (error) {
                    console.error(`Error fetching price for ${stock.symbol}:`, error);
                    prices[stock.symbol] = null;
                }
            }
            setLivePrices(prices);
        };

        fetchLivePrices();
        // Refresh prices every 5 minutes
        const interval = setInterval(fetchLivePrices, 300000);
        return () => clearInterval(interval);
    }, [stocks]);

    const calculateStockMetrics = (stock) => {
        if (!livePrices[stock.symbol]) return {
            totalInvestment: stock.price * stock.quantity,
            currentValue: 0,
            profitLoss: 0,
            percentageChange: 0
        };

        const totalInvestment = stock.price * stock.quantity;
        const currentValue = livePrices[stock.symbol] * stock.quantity;
        const profitLoss = currentValue - totalInvestment;
        const percentageChange = (profitLoss / totalInvestment) * 100;

        return {
            totalInvestment,
            currentValue,
            profitLoss,
            percentageChange
        };
    };

    if (sLoading) return (
        <div className="bg-black text-white rounded-lg p-6 max-w-sm mx-auto">
            <p>Loading stocks...</p>
        </div>
    );

    if (sError) return (
        <div className="bg-black text-white rounded-lg p-6 max-w-sm mx-auto">
            <p className="text-red-500">Error: {sError}</p>
        </div>
    );

    return (
        <div className="bg-black text-white rounded-lg p-6 w-full ">
            <h2 className="text-xl font-bold mb-4">My Portfolio</h2>
            <div className="space-y-4">
                {stocks && stocks?.stocks?.map((stock) => {
                    const metrics = calculateStockMetrics(stock);
                    const isProfitable = metrics.profitLoss > 0;

                    return (
                        <div key={stock._id} className="flex flex-col border-b border-gray-700 pb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-medium">{stock.symbol}</span>
                                    <p className="text-sm text-gray-400">{stock.stockName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">
                                        Qty: {stock.quantity} @ ${stock.price.toFixed(2)}
                                    </p>
                                    <p className="font-medium">
                                        Live: ${livePrices[stock.symbol]?.toFixed(2) || 'Loading...'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                                <div>
                                    <p>Investment: ${metrics.totalInvestment.toFixed(2)}</p>
                                    <p>Current: ${metrics.currentValue.toFixed(2)}</p>
                                </div>
                                <div className={`text-right ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                                    <p className="font-medium">
                                        {isProfitable ? '+' : ''}{metrics.profitLoss.toFixed(2)} USD
                                    </p>
                                    <p>
                                        ({isProfitable ? '+' : ''}{metrics.percentageChange.toFixed(2)}%)
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {stocks && stocks?.stocks?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold">Portfolio Summary</p>
                                <p className="text-sm text-gray-400">Total Investment: $
                                    {stocks?.stocks?.reduce((total, stock) => 
                                        total + (stock.price * stock.quantity), 0).toFixed(2)}
                {console.log(stocks.stocks)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">Total P/L:</p>
                                <p className={`font-bold ${
                                    stocks?.stocks?.reduce((total, stock) => 
                                        total + calculateStockMetrics(stock).profitLoss, 0) > 0 
                                    ? 'text-green-500' 
                                    : 'text-red-500'
                                }`}>
                                    ${stocks?.stocks?.reduce((total, stock) => 
                                        total + calculateStockMetrics(stock).profitLoss, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LeftProfile;