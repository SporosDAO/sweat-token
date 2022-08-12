import puppeteer from 'puppeteer';
import dappeteer from '@chainsafe/dappeteer';
import Xvfb from 'xvfb';

async function main() {

  const xvfb = new Xvfb();
  // start X Virtual Frame Buffer
  xvfb.startSync();

  const [metamask, page] = await dappeteer.bootstrap(puppeteer, {
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    metamaskVersion: 'v10.15.0'
  });

  // you can change the network if you want
  await metamask.switchNetwork('ropsten');

  // you can import a token
  await metamask.addToken('0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa');

  // go to a dapp and do something that prompts MetaMask to confirm a transaction
  await page.goto('http://frontend:3000');
  // const payButton = await page.$('#pay-with-eth');
  // await payButton.click();

  // 🏌
  // await metamask.confirmTransaction();

  xvfb.stopSync();
}

main();