import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";

import LogSig from "./Pages/LogSig";
import { useDispatch } from "react-redux";
import { loadUser } from "./features/userSlice";
import ProtectedRoute from "./Customs/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";


function App() {
  // Refs for scrollable sections
  const sectionsRef = {
    features: useRef(null),
    pricing: useRef(null),
    contact: useRef(null),
  };

  const scrollToSection = (section) => {
    sectionsRef[section]?.current.scrollIntoView({ behavior: "smooth" });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath !== "/login" && currentPath !== "/signin") {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppContent sectionsRef={sectionsRef} scrollToSection={scrollToSection} />
    </BrowserRouter>
  );
}

function AppContent({ sectionsRef, scrollToSection }) {
  const location = useLocation(); // Get the current location inside the Router context

  // Check if the current path is "/dashboard" or "/:productid"
  // const isDashboardRoute = location.pathname === "/dashboard";
  // const isProductRoute = /^\/[^/]+$/.test(location.pathname);
  // const isEmbedRoute = /^\/embed\/[^/]+$/.test(location.pathname);
  // const isEmbed1Route = /^\/embed\/[^/]+\/embed1$/.test(location.pathname);

  return (
    <>
   
      <Routes>

        <Route path="/login" element={<LogSig />} />
        <Route path="/signin" element={<LogSig />} />
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
     
      </Routes>
    
    </>
  );
}

export default App;
