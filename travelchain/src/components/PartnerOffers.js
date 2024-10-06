import React, { useState } from "react";

const PartnerOffers = () => {
  const [userPoints, setUserPoints] = useState(5000);

  const offers = [
    {
      id: 1,
      name: "SkyHigh Airlines",
      description: "Earn double miles on your next flight!",
      points: 1000,
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "LuxStay Hotels",
      description: "Free night stay at participating hotels.",
      points: 5000,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "LightningCars Rentals",
      description: "Enjoy a 50% discount on your next car rental.",
      points: 4000,
      image:
        "https://www.shutterstock.com/image-photo/cars-parked-row-on-outdoor-600nw-1378241768.jpg",
    },
  ];

  const redeemOffer = (offerPoints) => {
    if (userPoints >= offerPoints) {
      setUserPoints(userPoints - offerPoints);
      alert(`Redeemed for ${offerPoints} points`);
    } else {
      alert("Not enough points");
    }
  };

  return (
    <div className="container">
      <h2>Partner Offers</h2>
      <div className="points-balance">
        Your current balance: {userPoints} points
      </div>
      {offers.map((offer) => (
        <div key={offer.id} className="offer-card">
          <img src={offer.image} alt={offer.name} className="offer-image" />
          <div className="offer-content">
            <h3>{offer.name}</h3>
            <p>{offer.description}</p>
            <p>
              <strong>Points required: {offer.points}</strong>
            </p>{" "}
            <button
              onClick={() => redeemOffer(offer.points)}
              disabled={userPoints < offer.points}
            >
              Redeem Offer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartnerOffers;
