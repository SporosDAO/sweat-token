import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("GigContract", function () {

  const setupContract = async (admin: string): Promise<Contract> => {
    const GigContract = await ethers.getContractFactory("GigContract");
    const gigContract = await GigContract.deploy(admin);
    await gigContract.deployed();
    return gigContract
  }

  it("Should enforce roles", async function () {

    const [
      owner,
      pm1,
      contrib1
    ] = await ethers.getSigners();

    const gigContract = await setupContract(await owner.getAddress())

    // add pm1
    await gigContract.addProjectManager(await pm1.getAddress())

    // pm1 should be allowed to add contrib
    expect(gigContract
      .connect(pm1)
      .addContributor(await contrib1.getAddress())
    ).not.to.be.reverted
    
    // contrib1 should not be allowed to add contrib
    expect(gigContract
      .connect(contrib1)
      .releaseRewards(contrib1)
    ).to.be.reverted

  });
});
