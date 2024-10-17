import React, { createContext, useEffect, useState } from "react";
import Web3 from "web3";

// Create the context
export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [points, setPoints] = useState(0);
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);

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

  const contractAddress = "0x5d2da0402ed9843C04F8c77f3Ae7975B1e90d480"; // Replace with your deployed contract address

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

        // Fetch the user's points from the blockchain
        const userPoints = await contract.methods
          .viewPoints(accounts[0])
          .call();
        setPoints(Number(userPoints));
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
      // Force an update by re-fetching points
      await updatePoints();
      alert(`Successfully added ${amount} points.`);
    } catch (error) {
      console.error("Error issuing points:", error);
      alert("An error occurred while adding points.");
    }
  };

  // Function to update points after any transaction
  const updatePoints = async () => {
    if (loyaltyProgram && account) {
      try {
        const updatedPoints = await loyaltyProgram.methods
          .viewPoints(account)
          .call();
        setPoints(Number(updatedPoints)); // Trigger the re-render by setting state
        console.log("Updated Points:", Number(updatedPoints)); // Log updated points for debugging
      } catch (error) {
        console.error("Error updating points:", error);
      }
    }
  };

  const redeemPoints = async (requiredPoints) => {
    if (points >= requiredPoints) {
      try {
        await loyaltyProgram.methods.redeemPoints(requiredPoints).send({
          from: account,
        });
        const updatedPoints = await loyaltyProgram.methods
          .viewPoints(account)
          .call();
        setPoints(Number(updatedPoints));
      } catch (error) {
        console.error("Error redeeming points:", error);
      }
    } else {
      alert("Not enough points!");
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        points,
        issuePoints,
        redeemPoints,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
