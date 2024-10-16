const hre = require("hardhat");

async function main() {
  const LoyaltyProgram = await hre.ethers.getContractFactory("LoyaltyProgram");
  const loyaltyProgram = await LoyaltyProgram.deploy();

  await loyaltyProgram.deployed();
  console.log("LoyaltyProgram deployed to:", loyaltyProgram.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
