"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { loadUser } from "../features/userSlice";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { addStock, clearErrors, clearStock } from "../features/stockSlice";

function AddBusiness() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stock, sLoading, sError, success } = useSelector((state) => state.stock);
    const [tickerSuggestions, setTickerSuggestions] = useState([]);
    const [latestPrice, setLatestPrice] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        symbol: "",
        quantity: 1,
        ticker: ""
    });

    useEffect(() => {
        if (success) {
            toast.success("Stock added successfully");
            setFormData({
                name: "",
                symbol: "",
                quantity: 1,
                ticker: ""
            });
            dispatch(clearStock());
            dispatch(loadUser());
            setLatestPrice(null);
        }
        if (sError) {
            toast.error(sError);
            dispatch(clearErrors());
        }
    }, [success, sError, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "quantity" && value > 100) {
            toast.error("Quantity cannot exceed 100");
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTickerSearch = async (e) => {
        const keywords = e.target.value;
        setFormData((prev) => ({ ...prev, ticker: keywords }));
        if (keywords.length > 2) {
            const response = await axios.get(`https://finnhub.io/api/v1/search?q=${keywords}&exchange=US&token=ctrs3shr01qhb16nl920ctrs3shr01qhb16nl92g`);
            setTickerSuggestions(response.data.result || []);
        } else {
            setTickerSuggestions([]);
        }
    };

    const handleTickerSelect = async (symbol, name) => {
        setFormData((prev) => ({ ...prev, symbol: symbol, name: name, ticker: "" }));
        setTickerSuggestions([]);
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=ctrs3shr01qhb16nl920ctrs3shr01qhb16nl92g`);
        setLatestPrice(response.data.c);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            stockName: formData.name,
            symbol: formData.symbol,
            quantity: formData.quantity,
            price: latestPrice
        };
        dispatch(addStock(data));
    };

    const finalPrice = latestPrice ? (latestPrice * formData.quantity).toFixed(2) : null;

    return (
        <div className="bg-black min-h-screen w-[100vw] flex flex-col items-center p-4 ">
            <div className="p-4">
                <h1 className="text-2xl text-white">Buy Stock</h1>
            </div>
            <div className="w-full flex justify-center mt-4 relative">
                <div className="w-full max-w-lg">
                    <Label htmlFor="ticker">Search</Label>
                    <Input
                        type="text"
                        id="ticker"
                        name="ticker"
                        placeholder="Search Stocks by Name"
                        className="bg-white/5 text-white w-full"
                        value={formData.ticker}
                        onChange={handleTickerSearch}
                    />
                    {tickerSuggestions.length > 0 && (
                        <ul className="bg-white w-full text-black max-h-40 overflow-y-auto mt-2 absolute z-10 border-1 border-black rounded-md p-4">
                            {tickerSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleTickerSelect(suggestion.symbol, suggestion.description)}
                                    className="hover:bg-black hover:text-white cursor-pointer"
                                >
                                    {suggestion.symbol} - {suggestion.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="flex flex-col lg:flex-row mt-8 w-full max-w-5xl  md">
                <div className="container w-full lg:w-1/2 p-4 lg:p-16 bg-black text-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Stock Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                className="bg-white/5 w-full"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="symbol">Symbol</Label>
                            <Input
                                id="symbol"
                                name="symbol"
                                type="text"
                                className="bg-white/5 w-full"
                                value={formData.symbol}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {latestPrice && (
                            <div className="text-white">
                                <p>Latest Price: ${latestPrice}</p>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                type="number"
                                id="quantity"
                                name="quantity"
                                className="bg-white/5 w-full"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                required
                            />
                        </div>
                        {finalPrice && (
                            <div className="text-white">
                                <p>Total Price: ${finalPrice}</p>
                            </div>
                        )}
                        <div className="flex items-center w-full justify-center">
                            <button type="submit" className="bg-white text-black p-2 w-full rounded">Buy Stock</button>
                        </div>
                    </form>
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
                <div className="h-auto lg:h-[80vh] hidden md:flex flex-col bg-black w-full lg:w-1/2 p-4 text-white rounded-lg max-w-sm mx-auto mt-8 lg:mt-0">
                    <h2 className="text-xl">{formData.name || "Your Stock"}</h2>
                    <div className="mt-4">
                        <div className="mt-4">
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Name:</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    readOnly
                                    className="w-full px-3 py-2 border border-transparent rounded-md bg-white/5 text-white"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Symbol:</label>
                                <input
                                    type="text"
                                    value={formData.symbol}
                                    readOnly
                                    className="w-full px-3 py-2 border border-transparent rounded-md bg-white/5 text-white"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium">Quantity:</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    readOnly
                                    className="w-full px-3 py-2 border border-transparent rounded-md bg-white/5 text-white"
                                />
                            </div>
                            {finalPrice && (
                                <div className="text-white">
                                    <p>Total Price: ${finalPrice}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AddBusiness;
