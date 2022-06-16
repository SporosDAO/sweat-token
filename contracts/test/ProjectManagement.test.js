
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
    let PurchaseToken // PurchaseToken contract
    let purchaseToken // PurchaseToken contract instance
    let Whitelist // Whitelist contract
    let whitelist // Whitelist contract instance
    let Crowdsale // Crowdsale contract
    let crowdsale // Crowdsale contract instance
    let proposer // signerA
    let alice // signerB
    let bob // signerC


    beforeEach(async () => {
      ;[proposer, alice, bob] = await ethers.getSigners()

      Kali = await ethers.getContractFactory("KaliDAO")
      kali = await Kali.deploy()
      await kali.deployed()

      PurchaseToken = await ethers.getContractFactory("KaliERC20")
      purchaseToken = await PurchaseToken.deploy()
      await purchaseToken.deployed()
      await purchaseToken.init(
        "KALI",
        "KALI",
        "DOCS",
        [proposer.address],
        [getBigNumber(1000)],
        false,
        proposer.address
      )

      Whitelist = await ethers.getContractFactory("KaliAccessManager")
      whitelist = await Whitelist.deploy()
      await whitelist.deployed()

      Crowdsale = await ethers.getContractFactory("KaliDAOcrowdsale")
      crowdsale = await Crowdsale.deploy(whitelist.address, wethAddress)
      await crowdsale.deployed()

      ProjectManagement = await ethers.getContractFactory("ProjectManagement")
      projectManagement = await ProjectManagement.deploy()
      await projectManagement.deployed()
    })

    it.only("Should allow activating a new valid project", async function () {
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

        let projectDeadline = await latestBlockTimestamp() + hours(72);

        let manager = alice;
        let contributor = bob;

        // Set up payload for extension proposal
        let payload = ethers.utils.defaultAbiCoder.encode(
            // Project struct encoding
            [ "tuple(uint256, address, address, uint256, uint256, string)[]"],
            [
                [
                    123, // project id == 0 means new project
                    kali.address, // DAO address
                    manager.address, // project manager address
                    getBigNumber(200), // project budget
                    projectDeadline, // project deadline
                    "Website facelift" // project goal
                ]
            ]
        )

        await kali.propose(9, "New Project Proposal", [projectManagement.address], [1], [payload])

        console.debug("Proposal submitted on-chain");

        await kali.vote(1, true)
        await advanceTime(35)
        await kali.processProposal(1)
        const savedProject = await projectManagement.project(101);
        console.log({ savedProject });
        expect(savedProject).to.not.be.null();
        // await projectManagement
        //    .callExtension(kali.address, getBigNumber(50), {
        //         value: getBigNumber(50),
        // })
        // expect(await ethers.provider.getBalance(kali.address)).to.equal(
        //     getBigNumber(100)
        // )
        // expect(await kali.balanceOf(proposer.address)).to.equal(getBigNumber(110))
    })

})
