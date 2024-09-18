import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import "./App.css";
import RedeemPoints from "./components/RedeemPoints";

function App() {
  return (
    <div>
      <header>
        <div className="container">
          <h1>TravelChain</h1>
        </div>
      </header>
      <nav>
        <div className="container">
          <Link to="/">Home</Link>
          <Link to="/my-points/redeem-points">Redeem Points</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-points/redeem-points" element={<RedeemPoints />} />
      </Routes>
    </div>
  );
}

export default App;
