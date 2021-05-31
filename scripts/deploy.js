const ethers = require('ethers');
const hre = require("hardhat");
const fs = require("fs");

const initalSupplyTokens = 1000;
const decimalsMultiplier = ethers.BigNumber.from(10).pow(18);
const initialSupply = ethers.BigNumber.from(initalSupplyTokens).mul(decimalsMultiplier);

async function main() {
  const MOKLotteryToken = await hre.ethers.getContractFactory("MOKLotteryToken");
  const token = await MOKLotteryToken.deploy(initialSupply);
  await token.deployed();
  console.log("MOKLotteryToken deployed to: ", token.address);

  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy();
  await lottery.deployed();
  console.log("Lottery deployed to: ", lottery.address);

  const addressesJson = JSON.stringify({'MOKLotteryToken': token.address, 'Lottery': lottery.address});
  fs.writeFileSync("src/apis/addresses.json", addressesJson);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
