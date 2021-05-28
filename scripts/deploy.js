// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const MOKLotteryToken = await hre.ethers.getContractFactory("MOKLotteryToken");
  const token = await MOKLotteryToken.deploy(1000000);
  await token.deployed();
  console.log("MOKLotteryToken deployed to: ", token.address);

  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy();
  await lottery.deployed();
  console.log("Lottery deployed to: ", lottery.address);

  const addressesJson = JSON.stringify({'MOKLotteryToken': token.address, 'Lottery': lottery.address});
  fs.writeFileSync("src/apis/addresses.json", addressesJson);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
