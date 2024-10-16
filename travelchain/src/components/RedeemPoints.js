import React, { useState, useEffect } from "react";
import Web3 from "web3";

const RedeemPoints = () => {
  const [points, setPoints] = useState(0);
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

  // Initialize Web3 and smart contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contract = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setLoyaltyProgram(contract);

          // Fetch the user's points from the blockchain
          const userPoints = await contract.methods
            .viewPoints(accounts[0])
            .call();
          setPoints(userPoints);
        } catch (error) {
          console.error("Error initializing web3 or fetching points:", error);
        }
      }
    };

    initWeb3();
  }, []);

  // Use effect to fetch updated points when the contract or account changes
  useEffect(() => {
    const fetchPoints = async () => {
      if (loyaltyProgram && account) {
        try {
          const fetchedPoints = await loyaltyProgram.methods
            .viewPoints(account)
            .call();
          setPoints(fetchedPoints);
        } catch (error) {
          console.error("Error fetching points from blockchain:", error);
        }
      }
    };

    fetchPoints();
  }, [loyaltyProgram, account]);

  // Function to handle redeeming points
  const redeemPoints = async (requiredPoints) => {
    if (points >= requiredPoints) {
      try {
        await loyaltyProgram.methods.redeemPoints(requiredPoints).send({
          from: account,
          gas: 3000000, // Increase gas limit to avoid out-of-gas error
        });

        // Fetch updated points after redemption
        const updatedPoints = await loyaltyProgram.methods
          .viewPoints(account)
          .call();
        setPoints(updatedPoints);
        alert(`Successfully redeemed ${requiredPoints} points.`);
      } catch (error) {
        console.error("Error redeeming points:", error);
        alert("An error occurred while redeeming points. Please try again.");
      }
    } else {
      alert("You don't have enough points.");
    }
  };

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
