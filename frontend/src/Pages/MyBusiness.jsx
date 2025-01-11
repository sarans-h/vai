import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import InteractiveHoverButton from "../components/ui/interactive-hover-button";
import { useDispatch, useSelector } from "react-redux";
import { BriefcaseBusiness, User, Plus, Building } from "lucide-react";
import { clearErrors, deleteStock, getStocks, clearSuccess } from '../features/stockSlice';
import { loadUser } from "../features/userSlice";

const possibleIcons = [Building];
function getRandomIcon() {
  return possibleIcons[Math.floor(Math.random() * possibleIcons.length)];
}

const MyBusiness = () => {
  const dispatch = useDispatch();
  const { stocks, sLoading, sError, success } = useSelector((state) => state.stock);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(getStocks());
    if (sError) {
      toast.error(sError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Stock sold successfully");
      dispatch(getStocks());
      dispatch(loadUser());
      dispatch(clearSuccess());
    }
  }, [dispatch, success]);

  const handleQuantityChange = (stockId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [stockId]: value,
    }));
  };

  const handleSell = (stockId, quantity) => {
    dispatch(deleteStock({ stockId, quantity }));
    toast.success("Stock sold successfully");
  };

  return (
    <div className="bg-black min-h-screen w-full">
      <div className="p-4">
        <h1 className="text-2xl text-white">My Stocks</h1>
      </div>
      <p className="text-xl text-white p-4">
        Sell Stocks by selecting the stock and clicking on the sell button
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 px-4 sm:px-8 md:px-16 w-full cursor-pointer">
        {stocks && stocks.stocks.length > 0 ? (
          stocks.stocks.map((stock) => (
            <div key={stock._id} className="bg-white/5 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-white">{stock.stockName}</h2>
              <p className="text-gray-400">Symbol: {stock.symbol}</p>
              <p className="text-gray-400">Quantity: {stock.quantity}</p>
              <p className="text-gray-400">Price: ${stock.price.toFixed(2)}</p>
              <div className="flex flex-col sm:flex-row w-full justify-between items-center">
                <input
                  type="number"
                  min="1"
                  max={stock.quantity}
                  value={quantities[stock._id] || ""}
                  onChange={(e) => handleQuantityChange(stock._id, e.target.value)}
                  className="mt-2 p-2 w-full sm:w-36 rounded bg-white/5 text-white"
                  placeholder="Enter quantity"
                />
                <button
                  onClick={() => handleSell(stock._id, quantities[stock._id])}
                  className="mt-4 sm:mt-0 sm:ml-2 bg-white text-black px-3 py-1 rounded cursor-pointer"
                  disabled={!quantities[stock._id] || quantities[stock._id] > stock.quantity}
                >
                  Sell
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white col-span-4">No stocks available.</p>
        )}
      </div>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            background: "black",
            color: "white",
            border: "1px solid white",
          },
        }}
      />
    </div>
  );
};

export default MyBusiness;
