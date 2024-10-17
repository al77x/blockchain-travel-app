import React from "react";

const PartnerOffers = ({ points, redeemPoints }) => {
  const offers = [
    {
      id: 1,
      name: "SkyHigh Airlines",
      description: "Earn double miles on your next flight!",
      points: 1000,
    },
    {
      id: 2,
      name: "LuxStay Hotels",
      description: "Free night stay at participating hotels.",
      points: 5000,
    },
    {
      id: 3,
      name: "LightningCars Rentals",
      description: "Enjoy a 50% discount on your next car rental.",
      points: 4000,
    },
  ];

  return (
    <div className="container">
      <h2>Partner Offers</h2>
      <div className="points-balance">
        Your current balance: {points} points
      </div>
      {offers.map((offer) => (
        <div key={offer.id} className="offer-card">
          <h3>{offer.name}</h3>
          <p>{offer.description}</p>
          <p>
            <strong>Points required: {offer.points}</strong>
          </p>
          <button
            onClick={() => redeemPoints(offer.points)}
            disabled={points < offer.points}
          >
            Redeem Offer
          </button>
        </div>
      ))}
    </div>
  );
};

export default PartnerOffers;
