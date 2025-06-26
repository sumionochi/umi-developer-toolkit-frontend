require("dotenv").config();                  // Load PRIVATE_KEY from .env
require("@nomicfoundation/hardhat-toolbox"); // Hardhat helpers
require("@moved/hardhat-plugin");            // Umi Move support

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat", // used Hardhat for local testing
  networks: {
    hardhat: {
      // you can tinker with forking or accounts here if you like
    },
    devnet: {
      url: "https://devnet.moved.network",    // Umi Devnet RPC
      accounts: [process.env.PRIVATE_KEY],     // from .env
    },
  },
  moved: {
    // only scan this path for Move packages
    packagePaths: ["./contracts/move"]
  },
  paths: {
    // point the Solidity compiler at both locations if supported,
    // or keep the default of "./contracts" and move your evm folder back
    sources: "./contractsevm/evm"
  },
};
