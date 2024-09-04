import { HardhatUserConfig } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();
const DEPLOY_PRIVATE_KEY = process.env.DEPLOY_PRIVATE_KEY != undefined ? process.env.DEPLOY_PRIVATE_KEY:""
const INFURA_SEPOLIA_API_KEY = process.env.INFURA_SEPOLIA_API_KEY != undefined ? process.env.INFURA_SEPOLIA_API_KEY:""


const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks:{
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_SEPOLIA_API_KEY}`,
      accounts: [DEPLOY_PRIVATE_KEY],
    },
  }
};

export default config;
