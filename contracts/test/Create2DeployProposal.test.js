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
    console.log(`create2Deployer.address: ${ create2Deployer.address }`);
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
      { gasLimit: hre.config.xdeploy.gasLimit }
    );
    createReceipt = await createReceipt.wait();
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
    // ProposalType.EXTENSION = 9
    // https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
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

  it("Should deploy ProjectManagement contract via proposal.", async function () {
    const contract = await hre.ethers.getContractFactory(
      hre.config.xdeploy.contract
    );
    const initcode = contract.getDeployTransaction();
    // predictable deployment address for ProjectManagement
    computedContractAddress = await create2Deployer.computeAddress(
      hre.ethers.utils.id(hre.config.xdeploy.salt),
      hre.ethers.utils.keccak256(initcode.data)
    );
    console.log(
      `\nYour deployment parameters will lead to the following contract address: ${GREEN}${computedContractAddress}${RESET}\n` +
        `\n${YELLOW}=> If this does not match your expectation, given a previous deployment, you have either changed the value of${RESET}\n` +
        `${YELLOW}the salt parameter or the bytecode of the contract!${RESET}\n`
    );
    // The address of the ProjectManagement contract should not have existing bytecode onchain
    expect(await ethers.provider.getCode(computedContractAddress)).equal("0x");
    // prepare ABI for Create2Deploy.deploy
    // https://github.com/pcaversaccio/xdeployer/blob/8b79b9ac5021ccfce7d1589947669d169af3d666/src/contracts/Create2Deployer.sol#L34
    let ABI = [
      "function deploy( uint256 value, bytes32 salt, bytes memory code)"
    ];
    let iface = new ethers.utils.Interface(ABI);
    const deployProposalPayload = iface.encodeFunctionData("deploy", [ AMOUNT, hre.ethers.utils.id(hre.config.xdeploy.salt), initcode.data ])
    console.log('ABI payload for ProposalType.CALL to deploy ProjectManagement contract:', deployProposalPayload)
    // ProposalType.CALL = 2
    // https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L104
    console.log(`Processing CALL proposal to create2Deployer.address: ${ create2Deployer.address}`)
    await kali.propose(2, "Proposal to deploy ProjectManagement contract via create2deploy.", [create2Deployer.address], [0], [deployProposalPayload])
    console.debug("CALL proposal for ProjectManagement deployment submitted on-chain.");
    // approve proposal
    await expect(await kali.vote(1, true))
      .to.emit(kali, "VoteCast")
        .withArgs(proposer.address, 1, true)
    console.debug("CALL proposal for ProjectManagement approved.");
    await advanceTime(35)
    await expect(await await kali.processProposal(1, { gasLimit: hre.config.xdeploy.gasLimit }))
      .to.emit(kali, "ProposalProcessed")
        .withArgs(1, true) // expect proposal 1 to pass
    console.debug("CALL proposal for ProjectManagement deployment processed!");
    // Now that the ProjectManagement contract is deployed, it can be used as extension by other KaliDAO instances

    const kali2 = await Kali.deploy()
    await kali2.deployed()

    console.log("KaliDAO2 address", kali2.address)

    // Instantiate KaliDAO
    await kali2.init(
      "KALI2",
      "KALI2",
      "DOCS",
      false,
      [],
      [],
      [manager.address],
      [getBigNumber(10)],
      [30, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    )

    // propose via Kali extension
    // a project that authorizes the manager to call the extension and request minting
    const projectManagementContractAddress = computedContractAddress;
    const ProjectManagement = await ethers.getContractFactory("ProjectManagement");
    const projectManagement = await ProjectManagement.attach(
      projectManagementContractAddress
    );
    // Make sure a new Project can be approved and have a predictable state
    let nextProjectId = await projectManagement.nextProjectId();
    console.log(`ProjectManagement deployment address: ${projectManagement.address}`);
    console.log({ nextProjectId });
    // no projects proposed yet
    expect(nextProjectId).equal(100);
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
    // ProposalType.EXTENSION = 9
    // https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
    await kali2.connect(manager).propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
    console.debug("New Project Proposal submitted on-chain");
    await kali2.connect(manager).vote(1, true)
    await advanceTime(35)
    await expect(await await kali2.processProposal(1))
      .to.emit(kali2, "ProposalProcessed")
        .withArgs(1, true) // expect proposal 2 to pass
    nextProjectId = await projectManagement.nextProjectId();
    console.log(`ProjectManagement deployment address: ${projectManagement.address}`);
    console.log({ nextProjectId });
    expect(nextProjectId).equal(101);
    const savedProject = await projectManagement.projects(100);
    console.log({savedProject});
    expect(savedProject["id"]).equal(100);
    expect(savedProject["dao"]).equal(kali2.address);
    expect(savedProject["manager"]).equal(manager.address);
    expect(savedProject["budget"]).equal(getBigNumber(200));
    expect(savedProject["deadline"]).equal(projectDeadline);
    expect(savedProject["goals"]).equal("Website facelift");
    // Make sure a project manager can mint to contributors
    let mintRequest = ethers.utils.defaultAbiCoder.encode(
      // Project struct encoding
      [ "uint256", "address", "uint256"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(56) // mint amount in whole token units
      ]
    )
    await projectManagement
      .connect(manager).callExtension(kali2.address, [mintRequest]);
      expect(await kali2.balanceOf(contributor.address)).to.equal(getBigNumber(56))
  });

});
