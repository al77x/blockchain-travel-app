import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import Home from "./components/Home";
import RedeemPoints from "./components/RedeemPoints";
import PartnerOffers from "./components/PartnerOffers";
import Booking from "./components/Booking";
import "./App.css";

function App() {
  return (
    <Web3Provider>
      <div>
        <header>
          <div className="container">
            <h1>TravelChain</h1>
          </div>
        </header>
        <nav>
          <div className="container">
            <Link to="/">Home</Link>
            <Link to="/redeem-points">Redeem Points</Link>
            <Link to="/partner-offers">Partner Offers</Link>
            <Link to="/booking">Booking</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/redeem-points" element={<RedeemPoints />} />
          <Route path="/partner-offers" element={<PartnerOffers />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>
    </Web3Provider>
  );
}

export default App;
