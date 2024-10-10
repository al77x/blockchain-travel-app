import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x95fe5cc04A1553882A762Bc576094596B9e63756';

const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "service",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PointsIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PointsRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PointsTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "serviceProvider",
        "type": "address"
      }
    ],
    "name": "issuePoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      }
    ],
    "name": "redeemPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      }
    ],
    "name": "transferPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "viewPoints",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loyaltyContract, setLoyaltyContract] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [issueAddress, setIssueAddress] = useState('');
  const [issueAmount, setIssueAmount] = useState(0);
  const [isOwnerOrServiceProvider, setIsOwnerOrServiceProvider] = useState(false);
  const [networkError, setNetworkError] = useState('');

  useEffect(() => {
    checkWalletIsConnected();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (currentAccount && loyaltyContract) {
      getUserPoints();
      checkIfOwner();
    }
  }, [currentAccount, loyaltyContract]);

  const handleChainChanged = () => {
    window.location.reload();
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask installed!');
      return;
    } else {
      console.log('Wallet exists! We can proceed!');
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);

      // Check network
      const provider = new ethers.providers.Web3Provider(ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 17000) {
        setNetworkError('Please connect to the Holesky testnet');
        await switchToHolesky();
        return;
      } else {
        setNetworkError('');
        await initializeContract();
      }
    } else {
      console.log('No authorized account found');
    }
  };

  const switchToHolesky = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4268' }], // Hexadecimal for 17000
      });
      setNetworkError('');
      await initializeContract();
    } catch (switchError) {
      console.error(switchError);
      if (switchError.code === 4902) {
        // Chain not added, let's add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x4268', // Hexadecimal for 17000
                chainName: 'Holesky Testnet',
                nativeCurrency: {
                  name: 'Holesky ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://holesky.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
                blockExplorerUrls: ['https://holesky.etherscan.io'],
              },
            ],
          });
          setNetworkError('');
          await initializeContract();
        } catch (addError) {
          console.error(addError);
          alert('Failed to add Holesky testnet to MetaMask.');
        }
      } else {
        alert('Failed to switch to the Holesky testnet.');
      }
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Found an account! Address:', accounts[0]);
      setCurrentAccount(accounts[0]);

      // Check network
      const provider = new ethers.providers.Web3Provider(ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 17000) {
        setNetworkError('Please connect to the Holesky testnet');
        await switchToHolesky();
        return;
      } else {
        setNetworkError('');
        await initializeContract();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const initializeContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const loyaltyProgramContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setLoyaltyContract(loyaltyProgramContract);
  };

  const getUserPoints = async () => {
    try {
      const points = await loyaltyContract.viewPoints(currentAccount);
      setUserPoints(points.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfOwner = async () => {
    try {
      const owner = await loyaltyContract.owner();
      if (currentAccount.toLowerCase() === owner.toLowerCase()) {
        setIsOwnerOrServiceProvider(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const redeemPointsHandler = async () => {
    if (userPoints >= redeemAmount) {
      try {
        const tx = await loyaltyContract.redeemPoints(redeemAmount, {
          gasLimit: 500000,
        });
        await tx.wait();
        alert('Points redeemed!');
        getUserPoints();
      } catch (err) {
        console.log(err);
        alert('Failed to redeem points.');
      }
    } else {
      alert('Insufficient points to redeem!');
    }
  };

  const transferPointsHandler = async () => {
    if (userPoints >= transferAmount) {
      try {
        const tx = await loyaltyContract.transferPoints(transferAddress, transferAmount, {
          gasLimit: 500000,
        });
        await tx.wait();
        alert('Points transferred!');
        getUserPoints();
      } catch (err) {
        console.log(err);
        alert('Failed to transfer points.');
      }
    } else {
      alert('Insufficient points to transfer!');
    }
  };

  const issuePointsHandler = async () => {
    try {
      const tx = await loyaltyContract.issuePoints(issueAddress, issueAmount, currentAccount, {
        gasLimit: 500000,
      });
      await tx.wait();
      alert('Points issued!');
    } catch (err) {
      console.log('Error issuing points:', err);
      alert('Failed to issue points. Please check the console for details.');
    }
  };

  const connectWalletButton = () => {
    return <button onClick={connectWalletHandler}>Connect Wallet</button>;
  };

  const networkErrorMessage = () => {
    return <div style={{ color: 'red' }}>{networkError}</div>;
  };

  const userInterface = () => {
    return (
      <div>
        <h2>Your Points: {userPoints}</h2>

        <div>
          <h3>Redeem Points</h3>
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => setRedeemAmount(parseInt(e.target.value))}
          />
          <button onClick={redeemPointsHandler}>Redeem</button>
        </div>

        <div>
          <h3>Transfer Points</h3>
          <input
            type="text"
            placeholder="Recipient Address"
            onChange={(e) => setTransferAddress(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => setTransferAmount(parseInt(e.target.value))}
          />
          <button onClick={transferPointsHandler}>Transfer</button>
        </div>

        {isOwnerOrServiceProvider && (
          <div>
            <h3>Issue Points</h3>
            <input
              type="text"
              placeholder="User Address"
              onChange={(e) => setIssueAddress(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              onChange={(e) => setIssueAmount(parseInt(e.target.value))}
            />
            <button onClick={issuePointsHandler}>Issue</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Loyalty Program</h1>
      {networkError && networkErrorMessage()}
      {currentAccount ? userInterface() : connectWalletButton()}
    </div>
  );
}

export default App;