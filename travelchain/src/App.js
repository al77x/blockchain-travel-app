import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Web3 from "web3";
import Home from "./components/Home";
import RedeemPoints from "./components/RedeemPoints";
import PartnerOffers from "./components/PartnerOffers";
import LoyaltyDemo from "./components/LoyaltyDemo";
import "./App.css";

function App() {
  const [points, setPoints] = useState(0); // User points
  const [account, setAccount] = useState(""); // User account
  const [loyaltyProgram, setLoyaltyProgram] = useState(null); // Contract instance

  // Contract ABI and address
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

  const contractAddress = "0x5d2da0402ed9843C04F8c77f3Ae7975B1e90d480"; // Update with correct contract address

  // Initialize Web3 and fetch points on load
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable(); // Request account access
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]); // Set user account

          const contract = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setLoyaltyProgram(contract); // Set contract instance

          // Fetch points
          const userPoints = await contract.methods
            .viewPoints(accounts[0])
            .call();
          console.log("Fetched Points (Init):", Number(userPoints)); // Debug log for fetched points
          setPoints(Number(userPoints));
        } catch (error) {
          console.error("Error during Web3 initialization:", error);
        }
      }
    };
    initWeb3();
  }, []); // Run only once on load

  // Fetch points after every transaction or update
  const updatePoints = async () => {
    try {
      const userPoints = await loyaltyProgram.methods
        .viewPoints(account)
        .call();
      console.log("Updated Points (After Transaction):", Number(userPoints)); // Debug log
      setPoints(Number(userPoints)); // Update points in the state
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  // Function to redeem points
  const redeemPoints = async (requiredPoints) => {
    if (loyaltyProgram && account && points >= requiredPoints) {
      try {
        console.log("Redeeming Points:", requiredPoints); // Debug log
        await loyaltyProgram.methods
          .redeemPoints(requiredPoints)
          .send({ from: account });

        await updatePoints(); // Fetch updated points after redemption
      } catch (error) {
        console.error("Error redeeming points:", error);
      }
    } else {
      alert("You don't have enough points.");
    }
  };

  // Function to issue points (e.g., earn points)
  const issuePoints = async (amount) => {
    if (loyaltyProgram && account) {
      try {
        console.log("Issuing Points:", amount); // Debug log

        // Send transaction and wait for the receipt
        const transaction = await loyaltyProgram.methods
          .issuePoints(account, amount, account)
          .send({ from: account, gas: 3000000 });

        console.log("Transaction Hash:", transaction.transactionHash); // Debugging

        // After transaction is confirmed, update the points
        const updatedPoints = await loyaltyProgram.methods
          .viewPoints(account)
          .call();

        // Convert and update state immediately
        setPoints(Number(updatedPoints));
        console.log("Updated points after issuing:", updatedPoints); // Debug
      } catch (error) {
        console.error("Error issuing points:", error);
        alert("An error occurred while issuing points.");
      }
    } else {
      alert("Contract or account not initialized.");
    }
  };

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
          <Link to="/redeem-points">Redeem Points</Link>
          <Link to="/partner-offers">Partner Offers</Link>
          <Link to="/loyalty-demo">Loyalty Points Demo</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/redeem-points"
          element={<RedeemPoints points={points} redeemPoints={redeemPoints} />}
        />
        <Route
          path="/partner-offers"
          element={
            <PartnerOffers points={points} redeemPoints={redeemPoints} />
          }
        />
        <Route
          path="/loyalty-demo"
          element={<LoyaltyDemo points={points} issuePoints={issuePoints} />}
        />
      </Routes>
    </div>
  );
}

export default App;
