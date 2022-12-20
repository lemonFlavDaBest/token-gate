// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("TokenGate", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const TokenGate = await ethers.getContract("TokenGate", deployer);
  /*
  const result = await TokenGate.transferOwnership(
    "ADDRESS_HERE"
   );
   await result.wait()
*/
  
};
module.exports.tags = ["TokenGate"];
