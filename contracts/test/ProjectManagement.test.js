
const chai = require("chai")
const { expect } = require("chai")
const { getBigNumber, latestBlockTimestamp, advanceTime, hours } = require("./helpers.js")

chai.should()

// https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
const PROPOSAL_TYPE_EXTENSION = 9;

describe("ProjectManagement test cases", function () {
    let Kali // KaliDAO contract
    let kali // KaliDAO contract instance
    let ProjectManagement // SporosDAO Project Manager contract
    let projectManagement // SporosDAO Project Manager contract instance
    let proposer // signerA
    let alice // signerB
    let bob // signerC
    let manager
    let contributor

    beforeEach(async () => {
      [proposer, alice, bob] = await ethers.getSigners()
      manager = proposer;
      contributor = bob;

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
        await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
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

    it("Should revert a new project proposal with manager who is not a DAO token holder", async function () {
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
      // a project that authorizes the manager to call the extension  and request minting
      await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal without a manager", [projectManagement.address], [1], [payload])
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
      await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
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
      await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
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
      let propose = kali.propose(PROPOSAL_TYPE_EXTENSION, "Update Project Proposal", [projectManagement.address], [0], [payload])
      await expect(await propose)
        .to.emit(kali, "NewProposal")
          .withArgs(proposer.address, 2, PROPOSAL_TYPE_EXTENSION, "Update Project Proposal", [projectManagement.address], [0], [payload]);
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
      await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
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
      let propose = kali2.connect(alice).propose(PROPOSAL_TYPE_EXTENSION, "Update Project Proposal", [projectManagement.address], [1], [payload])
      await expect(await propose)
        .to.emit(kali2, "NewProposal")
          .withArgs(alice.address, 1, PROPOSAL_TYPE_EXTENSION, "Update Project Proposal", [projectManagement.address], [1], [payload]);
      console.log("Submitted Second proposal for project update from kali2")
      let savedProposal = await kali2.proposals(1)
      console.log("Saved second proposal: ", { savedProposal })
      await kali2.connect(alice).vote(1, true)
      console.log("Voted for kali2 proposal")
      await advanceTime(35)
      await expect(kali2.connect(alice).processProposal(1))
        .to.be.revertedWith("ProjectManagerNeedsDaoTokens()")
      // escape reverted proposal in order to be able to process the next proposal
      console.debug("Escaping reverted project proposal");
      await expect(await kali2.connect(alice).propose(10, "Escape reverted project proposal", [alice.address], [1], ["0x00"]))
        .to.emit(kali2, "NewProposal")
          .withArgs(alice.address, 2, 10, "Escape reverted project proposal", [alice.address], [1], ["0x00"]);
      console.debug("Voting to approve escape");
      await kali2.vote(2, true)
      console.debug("Voted to approve escape");
      await advanceTime(35)
      await kali2.processProposal(2)
      console.debug("Escaped reverted project proposal.");
      // mint alice some tokens in kali DAO
      await kali.propose(0, "Admin alice in kali DAO 1", [alice.address], [11], [0])
      console.debug("Proposing mint for Alice in kali 1");
      await kali.vote(2, true)
      await advanceTime(35)
      console.debug("Mint for Alice approved in kali 1");
      await kali.processProposal(2)
      const aliceTokens = await kali.balanceOf(alice.address)
      expect(aliceTokens).eq(11)
      console.debug("Alice now has some: tokens in kali 1: ", aliceTokens);
      // try again to request mint in a kali 1 project via kali2 call
      payload = ethers.utils.defaultAbiCoder.encode(
        // Project struct encoding
        [ "uint256", "address", "uint256", "uint256", "string"],
        [
          100, // project id == 0 means new project
          alice.address, // project manager address
          getBigNumber(500), // project budget
          projectDeadline + hours(5), // new project deadline
          "Next website facelift and blog setup" // updated project goals
        ]
      )
      propose = kali2.connect(alice).propose(PROPOSAL_TYPE_EXTENSION, "Update Project Proposal", [projectManagement.address], [0], [payload])
      await expect(await propose)
        .to.emit(kali2, "NewProposal")
          .withArgs(alice.address, 3, PROPOSAL_TYPE_EXTENSION, "Update Project Proposal", [projectManagement.address], [0], [payload]);
      console.log("Submitted Second proposal for project update from kali2")
      savedProposal = await kali2.proposals(3)
      console.log("Saved second proposal: ", { savedProposal })
      await kali2.connect(alice).vote(3, true)
      console.log("Voted for kali2 proposal")
      await advanceTime(35)
      await expect(kali2.connect(alice).processProposal(3))
        .to.be.revertedWith("ForbiddenDifferentDao()")
    })

  it("Should allow minting tokens by an authorized manager and an active project with sufficient budget.", async function () {
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
      await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
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
        [ "uint256", "address", "uint256", "string"],
        [
          100, // project id of the just activated project
          contributor.address, // address of contributor to receive DAO tokens
          getBigNumber(55), // mint amount in whole token units
          "landing page done"
        ]
      )
      await expect(await projectManagement
        .connect(manager)
        .callExtension(kali.address, [mintRequest])
      )
        .to.emit(projectManagement, "ExtensionCalled")
          .withArgs(kali.address, [mintRequest]);
      expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(55))
  })

  it("Should not allow spending over budget.", async function () {
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
    await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
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
      [ "uint256", "address", "uint256", "string"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(55), // mint amount in whole token units
        "landing page done"
      ]
    )

    await projectManagement
      .connect(manager)
      .callExtension(kali.address, [mintRequest]);
    expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(55))
    mintRequest = ethers.utils.defaultAbiCoder.encode(
    // Project struct encoding
      [ "uint256", "address", "uint256", "string"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(30), // mint amount in whole token units
        "completed landing page"
      ]
    )
    await projectManagement
      .connect(manager)
        .callExtension(kali.address, [mintRequest]);
    expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(85))
    mintRequest = ethers.utils.defaultAbiCoder.encode(
      // Project struct encoding
      [ "uint256", "address", "uint256", "string"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(120), // try to mint an amount that exceeds the budget
        "finished about page"
      ]
    )
    await expect(projectManagement.connect(manager).callExtension(kali.address, [mintRequest]))
      .to.be.revertedWith("ProjectNotEnoughBudget()")
  })

  it("Should not allow spending after deadline expired.", async function () {
    // set deadline before the current block
    let projectDeadline = await latestBlockTimestamp() - 1;
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
    await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
    console.debug("Proposal submitted on-chain");
    await kali.vote(1, true)
    await advanceTime(35)
    await kali.processProposal(1)
    let mintRequest = ethers.utils.defaultAbiCoder.encode(
      // Project struct encoding
      [ "uint256", "address", "uint256", "string"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(55), // mint amount in whole token units
        "finished team web page"
      ]
    )
    await expect(projectManagement.connect(manager).callExtension(kali.address, [mintRequest]))
      .to.be.revertedWith("ProjectExpired()")
    expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(0))
  })

  it("Should not allow minting via unknown project.", async function () {
    let mintRequest = ethers.utils.defaultAbiCoder.encode(
      // Project struct encoding
      [ "uint256", "address", "uint256", "string"],
      [
        153, // project id that does not exist in the contract
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(55), // mint amount in whole token units
        "finished product info page"
      ]
    )
    await expect(projectManagement.connect(alice).callExtension(kali.address, [mintRequest]))
      .to.be.revertedWith("ProjectUnknown()")
    expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(0))
  })

  it("Should not allow minting by unauthorized project manager.", async function () {
    let projectDeadline = await latestBlockTimestamp() + hours(3);
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
    await kali.propose(PROPOSAL_TYPE_EXTENSION, "New Project Proposal", [projectManagement.address], [1], [payload])
    console.debug("Proposal submitted on-chain");
    await kali.vote(1, true)
    await advanceTime(35)
    await kali.processProposal(1)
    let mintRequest = ethers.utils.defaultAbiCoder.encode(
      // Project struct encoding
      [ "uint256", "address", "uint256", "string"],
      [
        100, // project id of the just activated project
        contributor.address, // address of contributor to receive DAO tokens
        getBigNumber(55), // mint amount in whole token units
        "revamped home page"
      ]
    )
    await expect(projectManagement.connect(alice).callExtension(kali.address, [mintRequest]))
      .to.be.revertedWith("ForbiddenSenderNotManager()")
    expect(await kali.balanceOf(contributor.address)).to.equal(getBigNumber(0))
  })

})
