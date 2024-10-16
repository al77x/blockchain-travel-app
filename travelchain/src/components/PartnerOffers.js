import React, { useState, useEffect } from "react";
import Web3 from "web3";

const PartnerOffers = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [account, setAccount] = useState("");
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);

  const contractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "service",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "PointsIssued",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "PointsRedeemed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "PointsTransferred",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "points",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "serviceProvider",
          type: "address",
        },
      ],
      name: "issuePoints",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "points",
          type: "uint256",
        },
      ],
      name: "redeemPoints",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "points",
          type: "uint256",
        },
      ],
      name: "transferPoints",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "users",
      outputs: [
        {
          internalType: "uint256",
          name: "points",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "viewPoints",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const contractAddress = "0x2206B97A7a0fdc61a862DC5F6Dcb732D10bAe063";

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const contract = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        setLoyaltyProgram(contract);

        try {
          const userPoints = await contract.methods
            .viewPoints(accounts[0])
            .call();
          setUserPoints(userPoints);
        } catch (error) {
          console.error("Error fetching points:", error);
        }
      }
    };

    initWeb3();
  }, []);

  const redeemOffer = async (offerPoints) => {
    if (userPoints >= offerPoints) {
      try {
        await loyaltyProgram.methods
          .redeemPoints(offerPoints)
          .send({ from: account });
        const updatedPoints = await loyaltyProgram.methods
          .viewPoints(account)
          .call();
        setUserPoints(updatedPoints);
        alert(`Redeemed for ${offerPoints} points`);
      } catch (error) {
        console.error("Error redeeming offer:", error);
      }
    } else {
      alert("Not enough points");
    }
  };

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
            </p>
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
