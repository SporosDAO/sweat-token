
const { BigNumber } = require("ethers")
const chai = require("chai")
const { expect } = require("chai")

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

chai.should()

// Defaults to e18 using amount * 10^18
function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals))
}

async function advanceTime(time) {
    await ethers.provider.send("evm_increaseTime", [time])
}

async function latestBlockTimestamp() {
    const blocktime = await ethers.provider.send('eth_getBlockByNumber', ['latest', false]);
    return blocktime.timestamp;
}

function hours(n) {
    return n * 60 * 60.
}

// https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
const PROPOSAL_TYPE_EXTENSION = 9;

describe("ProjectManger", function () {
    let Kali // KaliDAO contract
    let kali // KaliDAO contract instance
    let ProjectManagement // SporosDAO Project Manager contract
    let projectManagement // SporosDAO Project Manager contract instance
    let proposer // signerA
    let alice // signerB
    let bob // signerC
    let manager

    beforeEach(async () => {
      ;[proposer, alice, bob] = await ethers.getSigners()
      manager = proposer;

      console.log("proposer address", proposer.address)
      console.log("alice address", alice.address)
      console.log("bob address", bob.address)


      Kali = await ethers.getContractFactory("KaliDAO")
      kali = await Kali.deploy()
      await kali.deployed()

      console.log("KaliDAO address", kali.address)

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
      )

      ProjectManagement = await ethers.getContractFactory("ProjectManagement")
      projectManagement = await ProjectManagement.deploy()
      await projectManagement.deployed()
    })

    it("Should allow activating a new valid project", async function () {
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
        await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
        console.debug("Proposal submitted on-chain");
        await kali.vote(1, true)
        await advanceTime(35)
        await expect(await await kali.processProposal(1))
          .to.emit(kali, "ProposalProcessed")
            .withArgs(1, true) // expect proposal 1 to pass
        const nextProjectId = await projectManagement.nextProjectId();
        console.log({ nextProjectId });
        expect(nextProjectId).equal(101);
        const savedProject = await projectManagement.projects(100);
        console.log({savedProject});
        // expecting:
        /*
        savedProject: [
          BigNumber { value: "100" },
          '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          BigNumber { value: "200000000000000000000" },
          BigNumber { value: "27773667612398080" },
          'Website facelift',
          id: BigNumber { value: "100" },
          dao: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          manager: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          budget: BigNumber { value: "200000000000000000000" },
          deadline: BigNumber { value: "27773667612398080" },
          goals: 'Website facelift'
        ]
        */
        // check saved project data
        expect(savedProject["id"]).equal(100);
        expect(savedProject["dao"]).equal(kali.address);
        expect(savedProject["manager"]).equal(manager.address);
        expect(savedProject["budget"]).equal(getBigNumber(200));
        expect(savedProject["deadline"]).equal(projectDeadline);
        expect(savedProject["goals"]).equal("Website facelift");
    })

    it("Should revert a new project proposal without a manager", async function () {
      let projectDeadline = await latestBlockTimestamp() + hours(72);
      // Set up payload for extension proposal
      let payload = ethers.utils.defaultAbiCoder.encode(
          // Project struct encoding
          [ "uint256", "address", "uint256", "uint256", "string"],
          [
            0, // project id == 0 means new project
            alice.address, // invalid manager address
            getBigNumber(200), // project budget
            projectDeadline, // project deadline
            "Website facelift" // project goal
          ]
      )
      // propose via Kali extension
      // a project that authorizes the manager to call the extension and request minting
      await kali.propose(9, "New Project Proposal without a manager", [projectManagement.address], [1], [payload])
      console.log("Proposal submitted")
      await kali.vote(1, true)
      await advanceTime(35)
      await expect(kali.processProposal(1))
        .to.be.revertedWith("ProjectManagerNeedsDaoTokens()")
    })

    it("Should not allow modifying a non existent project", async function () {
      let projectDeadline = await latestBlockTimestamp() + hours(72);
      // Set up payload for extension proposal
      let payload = ethers.utils.defaultAbiCoder.encode(
          // Project struct encoding
          [ "uint256", "address", "uint256", "uint256", "string"],
          [
            11, // invalid project id; it does not exist in the smart contract storage
            manager.address, // project manager address
            getBigNumber(200), // project budget
            projectDeadline, // project deadline
            "Website facelift" // project goal
          ]
      )
      // propose via Kali extension
      // a project that authorizes the manager to call the extension and request minting
      await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
      console.debug("Proposal submitted on-chain");
      await kali.vote(1, true)
      await advanceTime(35)
      await expect(kali.processProposal(1)).to.be.revertedWith("ProjectUnknown()");
    })

    it("Should allow modifying an existing project", async function () {
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
      await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
      console.debug("Proposal submitted on-chain");
      await kali.vote(1, true)
      console.debug("Proposal approved");
      await advanceTime(35)
      await expect(kali.processProposal(1))
        .to.emit(projectManagement, "ExtensionSet")
          // expect project id to be set to 100, which is the next id value in the contract
          .withArgs(kali.address, [100, kali.address, manager.address, getBigNumber(200), projectDeadline, "Website facelift"]);
      // next update project parameters
      payload = ethers.utils.defaultAbiCoder.encode(
        // Project struct encoding
        [ "uint256", "address", "uint256", "uint256", "string"],
        [
          100, // project id == 0 means new project
          manager.address, // project manager address
          getBigNumber(300), // project budget
          projectDeadline + hours(3), // new project deadline
          "Website facelift and blog setup" // updated project goals
        ]
      )
      let propose = kali.propose(9, "Update Project Proposal", [projectManagement.address], [1], [payload])
      await expect(await propose)
        .to.emit(kali, "NewProposal")
          .withArgs(proposer.address, 2, 9, "Update Project Proposal", [projectManagement.address], [1], [payload]);
      console.log("Submitted proposal for project update")
      await kali.vote(2, true)
      await advanceTime(35)
      await expect(await kali.processProposal(2))
        .to.emit(projectManagement, "ExtensionSet")
          .withArgs(kali.address, [100, kali.address, manager.address, getBigNumber(300), projectDeadline+hours(3), "Website facelift and blog setup"]);

    })


    it("Should not allow modifying an existing project that belongs to a different DAO", async function () {
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
      await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
      console.debug("First proposal submitted on-chain");
      await kali.vote(1, true)
      console.debug("First proposal approved");
      await advanceTime(35)
      await expect(kali.processProposal(1))
        .to.emit(projectManagement, "ExtensionSet")
          // expect project id to be set to 100, which is the next id value in the contract
          .withArgs(kali.address, [100, kali.address, manager.address, getBigNumber(200), projectDeadline, "Website facelift"]);
      // next update project parameters
      payload = ethers.utils.defaultAbiCoder.encode(
        // Project struct encoding
        [ "uint256", "address", "uint256", "uint256", "string"],
        [
          100, // project id == 0 means new project
          manager.address, // project manager address
          getBigNumber(300), // project budget
          projectDeadline + hours(3), // new project deadline
          "Website facelift and blog setup" // updated project goals
        ]
      )

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
        [alice.address],
        [getBigNumber(10)],
        [30, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      )

      console.log("Submitting Second proposal with project update from kali2")
      const propose = kali2.connect(alice).propose(9, "Update Project Proposal", [projectManagement.address], [1], [payload])
      await expect(await propose)
        .to.emit(kali2, "NewProposal")
          .withArgs(alice.address, 1, 9, "Update Project Proposal", [projectManagement.address], [1], [payload]);
      console.log("Submitted Second proposal for project update from kali2")
      const savedProposal = await kali2.proposals(1)
      console.log("Saved second proposal: ", { savedProposal })
      await kali2.connect(alice).vote(1, true)
      console.log("Voted for kali2 proposal")
      await advanceTime(35)
      await expect(kali2.connect(alice).processProposal(1))
        .to.be.revertedWith("ProjectManagerNeedsDaoTokens()")
    })

    it("Should allow minting tokens by an authorized manager and an active project with sufficient budget.", async function () {
      let projectDeadline = await latestBlockTimestamp() + hours(72);
      let contributor = bob;
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
      await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
      console.debug("Proposal submitted on-chain");
      await kali.vote(1, true)
      await advanceTime(35)
      await kali.processProposal(1)
      /*
        (
          uint256 projectId,
          address toContributorAccount,
          uint256 mintAmount
        )
      */
      // Set up payload for extension call
      let mintRequest = ethers.utils.defaultAbiCoder.encode(
        // Project struct encoding
        [ "uint256", "address", "uint256"],
        [
          100, // project id of the just activated project
          contributor.address, // address of contributor to receive DAO tokens
          getBigNumber(55) // mint amount in whole token units
        ]
      )
      await projectManagement
        .connect(manager)
        .callExtension(kali.address, [mintRequest]);
        expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(55))
  })

  it("Should not allow spending over budget.", async function () {
    let projectDeadline = await latestBlockTimestamp() + hours(72);
    let contributor = bob;
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
    await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])
    console.debug("Proposal submitted on-chain");
    await kali.vote(1, true)
    await advanceTime(35)
    await kali.processProposal(1)
    /*
      (
        uint256 projectId,
        address toContributorAccount,
        uint256 mintAmount
      )
    */
    // Set up payload for extension call
    let mintRequest = ethers.utils.defaultAbiCoder.encode(
      // Project struct encoding
      [ "uint256", "address", "uint256"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(55) // mint amount in whole token units
      ]
    )
    await projectManagement
      .connect(manager)
      .callExtension(kali.address, [mintRequest]);
      expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(55))
    mintRequest = ethers.utils.defaultAbiCoder.encode(
    // Project struct encoding
      [ "uint256", "address", "uint256"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(30) // mint amount in whole token units
      ]
    )
    await projectManagement
    .connect(manager)
    .callExtension(kali.address, [mintRequest]);
    expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(85))
    mintRequest = ethers.utils.defaultAbiCoder.encode(
      // Project struct encoding
      [ "uint256", "address", "uint256"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(120) // try to mint an amount that exceeds the budget
      ]
    )
    await expect(projectManagement.connect(manager).callExtension(kali.address, [mintRequest]))
      .to.be.revertedWith("ProjectNotEnoughBudget()")
  })
})
