import hre, { ethers, network } from "hardhat";
import { prompt } from "prompts";

(async () => {
  // MARK: Signer Info
  const [operator] = await ethers.getSigners();

  const [address, balance] = await Promise.all([
    operator.getAddress(),
    operator.getBalance(),
  ]);

  // MARK: get Contract Factory
  const EIP191VerifierFactory = (
    await ethers.getContractFactory("EIP191Verifier")
  ).connect(operator);

  // MARK: Deploying or Init
  const { isDeploying } = await prompt([
    {
      type: "confirm",
      name: "isDeploying",
      message: ` Deploy EIP191 Verifier Contract for ${network.name}
      🔱 with the account: ${address}
      target network: ${network.name}
      Do you deploying EIP191Verifier contract?`,
    },
  ]);
  let contractAddress = undefined;

  const scanUrl = hre.config.etherscan.customChains.find(
    (chain) => chain.network === network.name,
  )?.urls.browserURL;

  if (!scanUrl) {
    throw new Error("Not Found Scan URL");
  }

  if (!isDeploying) {
    contractAddress = await prompt([
      {
        type: "text",
        name: "address",
        message: `Please Input Exist Contract address: \n`,
      },
    ]);
  } else if (isDeploying) {
    const DeployingEIP191Verifier = await EIP191VerifierFactory.deploy();
    await DeployingEIP191Verifier.deployed();

    contractAddress = DeployingEIP191Verifier.address;

    console.log(`💎 EIP191Verifier deployed on ${network.name} : ${contractAddress}
      scan: ${scanUrl}/address/${contractAddress}
      `);
  }

  if (!contractAddress) {
    throw new Error("Undefined Contract");
  }

  // MARK: script logic
})();
