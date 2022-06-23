const { BigNumber } = require("ethers");
const chai = require("chai");
const { expect } = chai;
const { getBigNumber, latestBlockTimestamp, hours, advanceTime, AMOUNT, RESET, GREEN, YELLOW } = require("./helpers.js")

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

chai.should();

// https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
const PROPOSAL_TYPE_EXTENSION = 9;

describe("Deploy a new smart contract with counterfactual multi chain address via KaliDAO.ProposalType.CALL and CREATE2", function () {
  let Kali; // KaliDAO contract
  let kali; // KaliDAO contract instance
  let proposer; // signerA
  let alice; // signerB
  let bob; // signerC
  let manager;
  let contributor;
  let create2Deployer;

  beforeEach(async () => {
    [proposer, alice, bob] = await ethers.getSigners();
    manager = proposer;
    contributor = bob;

    console.log("proposer address", proposer.address);
    console.log("alice address", alice.address);
    console.log("bob address", bob.address);

    Kali = await ethers.getContractFactory("KaliDAO");
    kali = await Kali.deploy();
    await kali.deployed();

    console.log("KaliDAO address", kali.address);

    // Instantiate KaliDAO
    await kali.init(
      "KALI",
      "KALI",
      "DOCS",
      false,
      [],
      [],
      [proposer.address],
      [getBigNumber(10)],
      [30, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );

    // deploy create2deploy on the local hardhat testnet
    let hhcreate2Deployer = await hre.ethers.getContractFactory(
      "Create2DeployerLocal"
    );
    create2Deployer = await hhcreate2Deployer.deploy();

  });

  it("Should deploy ProjectManagement contract via create2deploy.", async function () {
    const contract = await hre.ethers.getContractFactory(
      hre.config.xdeploy.contract
    );
    const initcode = contract.getDeployTransaction();
    computedContractAddress = await create2Deployer.computeAddress(
      hre.ethers.utils.id(hre.config.xdeploy.salt),
      hre.ethers.utils.keccak256(initcode.data)
    );
    console.log(
      `\nYour deployment parameters will lead to the following contract address: ${GREEN}${computedContractAddress}${RESET}\n` +
        `\n${YELLOW}=> If this does not match your expectation, given a previous deployment, you have either changed the value of${RESET}\n` +
        `${YELLOW}the salt parameter or the bytecode of the contract!${RESET}\n`
    );
    if ((await ethers.provider.getCode(computedContractAddress)) !== "0x") {
      throw new NomicLabsHardhatPluginError(
        PLUGIN_NAME,
        `The address of the contract you want to deploy already has existing bytecode on ${hre.config.xdeploy.networks[0]}.
        It is very likely that you have deployed this contract before with the same salt parameter value.
        Please try using a different salt value.`
      );
    };
    let createReceipt = await create2Deployer.deploy(
      AMOUNT,
      hre.ethers.utils.id(hre.config.xdeploy.salt),
      initcode.data,
      { gasLimit: hre.config.xdeploy.gasLimit * 1000 }
    );
    createReceipt = await createReceipt.wait();
    // ProposalType.CALL = 2
    // https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L104
    // ProposalType.EXTENSION = 9
    // https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
    let projectDeadline = await latestBlockTimestamp() + hours(72);
    // Set up payload for extension proposal
    let payload = ethers.utils.defaultAbiCoder.encode(
        // Project struct encoding
        [ "uint256", "address", "uint256", "uint256", "string"],
        [
          0, // project id == 0 means new project
          manager.address, // project manager address
          getBigNumber(200), // project budget
          projectDeadline, // project deadline
          "Website facelift" // project goal
        ]
    )
    // propose via Kali extension
    // a project that authorizes the manager to call the extension and request minting
    const projectManagementContractAddress = computedContractAddress;
    const ProjectManagement = await ethers.getContractFactory("ProjectManagement");
    const projectManagement = await ProjectManagement.attach(
      projectManagementContractAddress
    );
    await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
    console.debug("Proposal submitted on-chain");
    await kali.vote(1, true)
    await advanceTime(35)
    await expect(await await kali.processProposal(1))
      .to.emit(kali, "ProposalProcessed")
        .withArgs(1, true) // expect proposal 1 to pass
    const nextProjectId = await projectManagement.nextProjectId();
    console.log(`ProjectManagement deployment address: ${projectManagement.address}`);
    console.log({ nextProjectId });
    expect(nextProjectId).equal(101);
    const savedProject = await projectManagement.projects(100);
    console.log({savedProject});
    expect(savedProject["id"]).equal(100);
    expect(savedProject["dao"]).equal(kali.address);
    expect(savedProject["manager"]).equal(manager.address);
    expect(savedProject["budget"]).equal(getBigNumber(200));
    expect(savedProject["deadline"]).equal(projectDeadline);
    expect(savedProject["goals"]).equal("Website facelift");
  });
});
