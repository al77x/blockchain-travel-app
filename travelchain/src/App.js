import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import "./App.css";

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
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
