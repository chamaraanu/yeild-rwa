import { ethers, upgrades } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  const owner = signers[0];
  const borrower = signers[1];

  console.log("Owner is: ", owner.address)

  const GoldfinchConfig = await ethers.getContractFactory("GoldfinchConfig");
  const goldfinchConfig = await upgrades.deployProxy(GoldfinchConfig, [owner.address]);
  await goldfinchConfig.waitForDeployment();
  const goldfinchConfigAddress = await goldfinchConfig.getAddress();
  console.log("GoldfinchConfig deployed to ", goldfinchConfigAddress);

  const MonthlyPeriodMapper = await ethers.getContractFactory("MonthlyPeriodMapper");
  const monthlyPeriodMapper = await MonthlyPeriodMapper.deploy();
  await monthlyPeriodMapper.waitForDeployment();
  console.log("MonthlyPeriodMapper deployed to ", await monthlyPeriodMapper.getAddress());

  const Schedule = await ethers.getContractFactory("Schedule");
  const schedule = await Schedule.deploy(monthlyPeriodMapper.getAddress(), 12, 4, 4, 2);
  await schedule.waitForDeployment();
  console.log("Schedule deployed to ", await schedule.getAddress());

  const ConfigHelper = await ethers.getContractFactory("ConfigHelper");
  const configHelper = await ConfigHelper.deploy()
  await configHelper.waitForDeployment();
  console.log("ConfigHelper deployed to ", await configHelper.getAddress());

  

  // Deploy SafeERC20Transfer
  const SafeERC20TransferFactory = await ethers.getContractFactory("SafeERC20Transfer");
  const safeERC20Transfer = await SafeERC20TransferFactory.deploy();
  await safeERC20Transfer.waitForDeployment();
  console.log("SafeERC20Transfer deployed to:", await safeERC20Transfer.getAddress());

  // Deploy SafeMathUpgradeable
  const SafeMathUpgradeableFactory = await ethers.getContractFactory("SafeMathUpgradeable");
  const safeMathUpgradeable = await SafeMathUpgradeableFactory.deploy();
  await safeMathUpgradeable.waitForDeployment();
  console.log("SafeMathUpgradeable deployed to:", await safeMathUpgradeable.getAddress());

  const TranchingLogic = await ethers.getContractFactory("TranchingLogic"
    // , { libraries: {
    //   "contracts/protocol/core/ConfigHelper.sol:ConfigHelper": configHelper,
    // },}
  );
  const tranchingLogic = await TranchingLogic.deploy()
  await tranchingLogic.waitForDeployment();
  console.log("TranchingLogic deployed to ", await tranchingLogic.getAddress());

  const TranchedPool = await ethers.getContractFactory("TranchedPool"
    , { libraries: {
      "contracts/protocol/core/TranchingLogic.sol:TranchingLogic": tranchingLogic,
      // "contracts/protocol/core/ConfigHelper.sol:ConfigHelper": configHelper,
      // SafeERC20Transfer: safeERC20Transfer,
      // SafeMathUpgradeable: safeMathUpgradeable,
    },}
  );
  const tranchedPool = await upgrades.deployProxy(TranchedPool, [
    goldfinchConfigAddress,
    borrower.address,
    15,
    10,
    10,
    await schedule.getAddress(),
    5,
    10,
    []
  ], { unsafeAllowLinkedLibraries: true });
  await tranchedPool.waitForDeployment();
  console.log("TranchedPool deployed to ", await tranchedPool.getAddress());


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
