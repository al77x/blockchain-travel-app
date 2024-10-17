import React from "react";

const RedeemPoints = ({ points, redeemPoints }) => {
  return (
    <div className="container">
      <h2>Redeem Your Points</h2>
      <div className="points-balance">
        Your current balance: {points} points
      </div>
      <div className="redemption-options">
        <div className="redemption-option">
          <h3>Flight Discount</h3>
          <p>Get $50 off your next flight!</p>
          <button onClick={() => redeemPoints(2500)} disabled={points < 2500}>
            Redeem for 2500 points
          </button>
        </div>
        <div className="redemption-option">
          <h3>Hotel Night</h3>
          <p>One free night at participating hotels!</p>
          <button onClick={() => redeemPoints(3000)} disabled={points < 3000}>
            Redeem for 3000 points
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemPoints;
