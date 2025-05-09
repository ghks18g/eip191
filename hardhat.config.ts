import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  // solidity: "0.8.28",
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "london",
        },
      },
    ],
  },
};

export default config;
