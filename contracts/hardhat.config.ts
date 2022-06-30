import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-watcher";
import "hardhat-deploy";
import "hardhat-dependency-compiler";
import "solidity-coverage";
import "xdeployer";
require("hardhat-tracer");

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task(
  "accounts",
  "Prints the list of accounts",
  async (taskArgs: unknown, hre: HardhatRuntimeEnvironment) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(account.address);
    }
  }
);

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./build/artifacts",
    cache: "./build/cache",
    sources: "./src",
    tests: "./test",
  },
  typechain: {
    outDir: "./build/types",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  watcher: {
    test: {
      tasks: [{ command: "compile", params: { quiet: true } }, "test"],
      files: ["./src", "./test"],
      verbose: true,
    },
  },
  dependencyCompiler: {
    // path to write temp compiled deps relative to ./src
    path: "tmp",
    // paths relative to './src/hardhat-dependency-compiler/
    paths: ["kalidao/contracts/KaliDAO.sol"],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
    },
    carol: {
      default: 3,
    },
  },
  xdeploy: {
    contract: "ProjectManagement",
    // constructorArgsPath: "./deploy-args.ts",
    salt: "SporosDAO",
    signer:
      "0xe1904817e407877ea09135933f39121aa68ed0d9729d301084c544204171d100",
    networks: ["hardhat"], // "rinkeby"],
    rpcUrls: [
      "hardhat", // "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    ],
    gasLimit: 1.2 * 10 ** 7,
  },
};

export default config;
