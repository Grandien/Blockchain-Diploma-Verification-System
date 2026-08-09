import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

export default {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    amoy: {
      url: process.env.AMOY_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
};
