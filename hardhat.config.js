require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.4",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x4608529525b4b8c2da797135fe9e34a978884d20d2f6d69dc6c66e75d224ea67",
      ],
    },
  },
};
