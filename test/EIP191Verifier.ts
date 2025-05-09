import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ethers, expect, config } from "hardhat";
import { EIP191Verifier } from "../typechain-types";
describe("EIP191Verfier", () => {
  let operator: SignerWithAddress;

  let EIP191Verifier: EIP191Verifier;

  let data: Uint8Array<ArrayBufferLike>;

  let messageHash: string;

  let signedMessage: string;

  let data2: Uint8Array<ArrayBufferLike>;

  let messageHash2: string;

  let signedMessage2: string;

  const message = "This is Test Message";

  // MARK: Deploy EIP191Verifier
  before(async () => {
    [operator] = await ethers.getSigners();

    console.log(`Deploying Contract EIP191Verifier
        deployer: ${operator.address}
        `);

    const EIP191VerifierFactory = (
      await ethers.getContractFactory("EIP191Verifier")
    ).connect(operator);

    EIP191Verifier = await EIP191VerifierFactory.deploy();

    console.log(`💎 EIP191Verifier deployed : ${EIP191Verifier.address}`);
  });

  // MARK: SignMessage For ethers.util (veryfyMessage)
  before(async () => {
    const preFix = ethers.utils.solidityPack(
      // prefix / sig version / validator(address)
      ["bytes1", "bytes1", "address"],
      ["0x19", "0x00", operator.address],
    );

    console.log("prefix: ", preFix);

    data = ethers.utils.concat([preFix, ethers.utils.toUtf8Bytes(message)]);
    console.log("data: ", data);

    messageHash = ethers.utils.keccak256(data);
    console.log("messageHash: ", messageHash);

    signedMessage = await operator.signMessage(
      ethers.utils.arrayify(messageHash),
    );

    console.log("signedMessage: ", signedMessage);
    console.log("=========================================================");
    const user = new ethers.Wallet(
      (config.networks.sepolia.accounts as string[])[0],
      operator.provider,
    );

    const preFix2 = ethers.utils.solidityPack(
      ["bytes1", "bytes1", "address"],
      ["0x19", "0x00", EIP191Verifier.address],
    );

    const data2 = ethers.utils.concat([
      preFix2,
      ethers.utils.toUtf8Bytes(message),
    ]);
    console.log("data2: ", data2);
    messageHash2 = ethers.utils.keccak256(data2);
    console.log("messageHash2:", messageHash2);
    // EIP-191 포맷 없이 다이렉트 해시 서명
    const rawSignedMessage = user._signingKey().signDigest(messageHash2);
    console.log("rawSignedMessage:", rawSignedMessage);
    signedMessage2 = ethers.utils.joinSignature(rawSignedMessage);
    console.log("signedMessage2:", signedMessage2);

    // const { r, s, v } = ethers.utils.splitSignature(signature2);

    const recovered = ethers.utils.recoverAddress(messageHash2, signedMessage2);
    console.log("recovered:", recovered);
    console.log(user.address);
    console.log("=========================================================");
  });

  it("Deployed", async () => {
    expect(EIP191Verifier.address).to.equal(EIP191Verifier.address);
  });

  it("ethers.util.verifyMessage", async () => {
    console.log("messageHash: ", messageHash);
    console.log(`signedMessage: `, signedMessage);
    const recover = await ethers.utils.verifyMessage(
      ethers.utils.arrayify(messageHash),
      signedMessage,
    );
    console.log("recover: ", recover);

    expect(operator.address).to.equal(recover);
  });

  it("EIP191Verifier.verifyMessage", async () => {
    console.log("messageHash: ", messageHash);
    console.log(`signedMessage: `, signedMessage);
    const recover = await EIP191Verifier.verifyMessage(
      messageHash,
      signedMessage,
    );
    console.log("recover: ", recover);

    expect(operator.address).to.equal(recover);
  });
});
