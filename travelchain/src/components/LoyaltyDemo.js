import React, { useState, useEffect } from "react";
import Web3 from "web3";

const LoyaltyDemo = () => {
  const [points, setPoints] = useState(0); // Holds the user's points
  const [account, setAccount] = useState("");
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);

  // ABI and contract address
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

  const contractAddress = "0xdC8bAD1BFd3657627024B0AA7CD6FD06e969889f"; // Replace with your deployed contract address

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

        // Fetch the user's points from the blockchain and convert BigInt to number
        const userPoints = await contract.methods
          .viewPoints(accounts[0])
          .call();
        const convertedPoints = Number(userPoints); // Convert BigInt to a regular number
        console.log("Fetched Points:", convertedPoints); // Add this line for debugging
        setPoints(convertedPoints); // Set the points in the state
      }
    };

    initWeb3();
  }, []);

  // Function to issue points (e.g., earn points)
  const issuePoints = async (amount) => {
    try {
      await loyaltyProgram.methods
        .issuePoints(account, amount, account)
        .send({ from: account, gas: 3000000 });
      const updatedPoints = await loyaltyProgram.methods
        .viewPoints(account)
        .call();
      const convertedPoints = Number(updatedPoints); // Convert BigInt to number
      setPoints(convertedPoints); // Update points after issuing
      console.log("Updated Points in State:", convertedPoints); // Debug line
      alert(`Successfully added ${amount} points.`);
    } catch (error) {
      console.error("Error issuing points:", error);
      alert("An error occurred while adding points.");
    }
  };

  // Function to redeem points
  const redeemPoints = async (requiredPoints) => {
    if (points >= requiredPoints) {
      try {
        await loyaltyProgram.methods
          .redeemPoints(requiredPoints)
          .send({ from: account });
        const updatedPoints = await loyaltyProgram.methods
          .viewPoints(account)
          .call();
        const convertedPoints = Number(updatedPoints); // Convert BigInt to number
        setPoints(convertedPoints); // Update points after redeeming
        alert(`Successfully redeemed ${requiredPoints} points.`);
      } catch (error) {
        console.error("Error redeeming points:", error);
        alert("An error occurred while redeeming points.");
      }
    } else {
      alert("You don't have enough points.");
    }
  };

  return (
    <div className="container">
      <h2>Blockchain-Based Travel Loyalty Program Demo</h2>

      {/* Display points balance */}
      <div className="points-balance">
        Your current balance: {points} points {/* Display points here */}
      </div>

      {/* Buttons to simulate earning points */}
      <div>
        <h3>Earn Points</h3>
        <button onClick={() => issuePoints(1000)}>
          Book Flight (Earn 1000 points)
        </button>
        <button onClick={() => issuePoints(500)}>
          Stay at Hotel (Earn 500 points)
        </button>
        <button onClick={() => issuePoints(300)}>
          Rent a Car (Earn 300 points)
        </button>
      </div>

      {/* Redemption options */}
      <div className="redemption-options">
        <div className="redemption-option">
          <h3>Flight Discount</h3>
          <button onClick={() => redeemPoints(2500)} disabled={points < 2500}>
            Redeem 2500 points
          </button>
        </div>
        <div className="redemption-option">
          <h3>Hotel Night</h3>
          <button onClick={() => redeemPoints(3000)} disabled={points < 3000}>
            Redeem 3000 points
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDemo;
