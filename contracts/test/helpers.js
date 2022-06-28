
const { BigNumber } = require("ethers")

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// Defaults to e18 using amount * 10^18
function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
}

async function advanceTime(time) {
  await ethers.provider.send("evm_increaseTime", [time]);
}

async function latestBlockTimestamp() {
  const blocktime = await ethers.provider.send("eth_getBlockByNumber", [
    "latest",
    false,
  ]);
  return blocktime.timestamp;
}

function hours(n) {
  return n * 60 * 60;
}

exports.wethAddress = wethAddress;
exports.getBigNumber = getBigNumber;
exports.advanceTime = advanceTime;
exports.latestBlockTimestamp = latestBlockTimestamp;
exports.hours = hours;

// xdeployer exports
exports.RESET = "\x1b[0m";
exports.GREEN = "\x1b[32m";
exports.RED = "\x1b[31m";
exports.YELLOW = "\x1b[33m";

exports.AMOUNT = 0;
