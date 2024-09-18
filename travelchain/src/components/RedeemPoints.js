import React, { useState } from "react";
import travelVoucher from "../assets/travel-voucher.png";

const RedeemPoints = () => {
  const [points, setPoints] = useState(5000);

  const redeemPoints = (requiredPoints, reward) => {
    if (points >= requiredPoints) {
      setPoints(points - requiredPoints);
      alert(`Successfully redeemed ${reward} for ${requiredPoints} points.`);
    } else {
      alert("You don't have enough points.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Redeem Your Points</h2>
        <div className="points-balance">
          Your current balance: {points} points
        </div>
        <div className="redemption-options">
          <div className="redemption-option">
            <h3>Flight Discount</h3>
            <p>Get $50 off your next flight!</p>
            <p>
              <img
                src={travelVoucher}
                alt="Travel Voucher"
                style={{ width: "150px", height: "150px" }}
              />
            </p>
            <button onClick={() => redeemPoints(2500, "Flight Discount")}>
              Redeem for 2500 points
            </button>
          </div>
          <div className="redemption-option">
            <h3>Hotel Night</h3>
            <p>One free night at participating hotels!</p>
            <p>
              <img
                src="https://media.istockphoto.com/id/492189224/photo/seaview-bedroom.jpg?s=612x612&w=0&k=20&c=tSL5OoSdxW3l7WzdBGU2_NnGNjDH88twjNZTTkll2jY="
                alt="Travel Voucher"
                style={{ width: "300px", height: "150px" }}
              />
            </p>
            <button onClick={() => redeemPoints(3000, "Hotel Night")}>
              Redeem for 3000 points
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemPoints;
