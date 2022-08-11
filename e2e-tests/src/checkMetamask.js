import puppeteer from 'puppeteer';
import dappeteer from '@chainsafe/dappeteer';

async function main() {
  const [metamask, page] = await dappeteer.bootstrap(puppeteer, {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    metamaskVersion: 'v10.15.0'
  });

  // you can change the network if you want
  await metamask.switchNetwork('ropsten');

  // you can import a token
  await metamask.addToken('0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa');

  // go to a dapp and do something that prompts MetaMask to confirm a transaction
  await page.goto('http://my-dapp.com');
  const payButton = await page.$('#pay-with-eth');
  await payButton.click();

  // 🏌
  await metamask.confirmTransaction();
}

main();