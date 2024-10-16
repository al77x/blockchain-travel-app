import React, { useState, useEffect } from "react";
import Web3 from "web3";

const LoyaltyApp = () => {
  const [account, setAccount] = useState("");
  const [points, setPoints] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState(0); // New state to handle points to add

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

  const contractAddress = "0x2206B97A7a0fdc61a862DC5F6Dcb732D10bAe063"; // Use your deployed contract address

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

        const userPoints = await contract.methods
          .viewPoints(accounts[0])
          .call();
        setPoints(userPoints);
      }
    };

    initWeb3();
  }, []);

  // Function to add points
  const issuePoints = async () => {
    try {
      await loyaltyProgram.methods
        .issuePoints(account, pointsToAdd, account)
        .send({ from: account, gas: 3000000 });
      const updatedPoints = await loyaltyProgram.methods
        .viewPoints(account)
        .call();
      setPoints(updatedPoints); // Update points after issuing
      alert(`Successfully added ${pointsToAdd} points.`);
    } catch (error) {
      console.error("Error issuing points:", error);
      alert("An error occurred while adding points. Please try again.");
    }
  };

  return (
    <div>
      <h3>Blockchain Loyalty Program</h3>
      <p>Your account: {account}</p>
      <p>Points on Blockchain: {points}</p>

      {/* Input field to specify points to add */}
      <input
        type="number"
        value={pointsToAdd}
        onChange={(e) => setPointsToAdd(Number(e.target.value))}
        placeholder="Enter points to add"
      />
      <button onClick={issuePoints}>Add Points</button>
    </div>
  );
};

export default LoyaltyApp;
