import React, { useEffect } from "react";
import LeftProfile from "./Leftprofile.jsx";
import { useDispatch, useSelector } from "react-redux";
import InteractiveHoverButton from "../components/ui/interactive-hover-button";
import { Toaster } from "react-hot-toast";
import { logoutUser } from "../features/userSlice.js"; // Import logoutUser action
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getPLHistory } from '../features/stockSlice'; // Import the new action

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Profile() {
  const dispatch = useDispatch();
  const { user, plHistory } = useSelector((state) => ({
    user: state.user.user,
    plHistory: state.stock.plHistory.profitLossHistory
  }));

  useEffect(() => {
    dispatch(getPLHistory()); // Fetch P/L history on component mount
  }, [dispatch]);

  const MAX_ENTRIES = 10; // Maximum number of entries to display

  const sortedPortfolio = user?.dailyPortfolio
    ?.slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

  const limitedPortfolio = sortedPortfolio.slice(-MAX_ENTRIES);

  const data = {
    labels: limitedPortfolio.map(entry => new Date(entry.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Wallet Value',
        data: limitedPortfolio.map(entry => entry.value) || [],
        borderColor: '#ffffff',
        fill: false
      }
    ]
  };

  // Calculate point colors based on Profit/Loss trend
  const pointColors = plHistory?.map((entry, index) => {
    if (index === 0) return 'green'; // First entry defaults to green
    return entry.profitLoss >= plHistory[index - 1].profitLoss ? 'green' : 'red';
  });

  const plData = {
    labels: plHistory
      ?.slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-MAX_ENTRIES)
      .map(entry => new Date(entry.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Profit/Loss',
        data: plHistory
          ?.slice()
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-MAX_ENTRIES)
          .map(entry => entry.profitLoss) || [],
        borderColor: '#ffffff',
        fill: false,
        pointBackgroundColor: pointColors?.slice(-MAX_ENTRIES), // Apply the calculated colors
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value ($)'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Daily Wallet Value'
      }
    }
  };

  const plOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5
        }
      },
      y: {
        title: {
          display: true,
          text: 'Profit/Loss ($)'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Daily Profit/Loss'
      }
    }
  };

  return (
    <div className=" w-full   h-screen bg-black justify-center items-center overflow-scroll">
        <div className="flex md:flex-row flex-col">
      <div
        className="w-full md:w-[70vw] h-[100vh] bg-black  border-r-[1px] border-[#7e7b7b5b]" // Reduced width from 70vw to 60vw
        style={{
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For IE and Edge
        }}
      >
        <style>
          {`
                    div::-webkit-scrollbar {
                        display: none; /* For Chrome, Safari, and Opera */
                    }
                `}
        </style>
        <div className="p-4 h-[100vh]">
          <h1 className="text-2xl text-white">My Profile</h1>
          <div className="p-4">
            <h1 className="text-white font-bold text-4xl mt-5">Overview</h1>
            <div className="overflow-hidden rounded  mx-auto my-4">
              <div className="grid grid-cols-1  md:grid-cols-4 gap-6 mt-10 px-4 w-full max-w-4xl">
                <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    My Wallet
                  </h3>
                  <p className="text-gray-400">${user?.wallet?.toFixed(2)}</p>
                  <InteractiveHoverButton 
                    onClick={() => dispatch(logoutUser())} 
                    className="mt-2 text-white"
                    text="Logout" />
                  
                </div>
              </div>
            </div>

            {/* New Flex Container for Side-by-Side Graphs with Border */}
            <div className="flex flex-col md:flex-row  justify-between">
              <div className="w-full md:w-1/2 h-52 mb-8 md:mr-4 border-r-2 border-gray-700"> {/* Adjusted height */}
                <Line data={data} options={options} />
              </div>
              <div className="w-full md:w-1/2 h-52 border-r-2 border-gray-700 z-10"> {/* Adjusted height */}
                <Line data={plData} options={plOptions} />
              </div>
            </div>
            {/* End of Flex Container */}

          </div>
        </div>
      </div>

      <div className="bg-[#000000ee] flex md:w-[26vw] w-full h-[100vh] items-center justify-center overflow-auto">
        <LeftProfile />
      </div>
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
}

export default Profile; // Ensure the component name matches export
