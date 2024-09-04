import { ethers, upgrades } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const owner = signers[0];

  console.log(owner.address)

  const GoldfinchConfig = await ethers.getContractFactory("GoldfinchConfig");
  const goldfinchConfig = await upgrades.deployProxy(GoldfinchConfig, [owner.address]);
  await goldfinchConfig.waitForDeployment();
  
  console.log("GoldfinchConfig deployed to ", await goldfinchConfig.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
