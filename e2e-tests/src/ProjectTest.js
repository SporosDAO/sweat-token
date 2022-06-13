import url from 'url';
import { createRunner, PuppeteerRunnerExtension } from '@puppeteer/replay';
import pti from 'puppeteer-to-istanbul';
import puppeteer from 'puppeteer';

// Note: Please run this test after creating a public DAO named SporosDao
// And make sure that SporosDao has a project named 'My New Project June 3 2022'

const browser = await puppeteer.launch({
    headless: true,
});

const page = await browser.newPage();

class CoverageExtension extends PuppeteerRunnerExtension {

    async startCoverage() {
        // Enable both JavaScript and CSS coverage
        await Promise.all([
            page.coverage.startJSCoverage(),
            page.coverage.startCSSCoverage(),
        ]);
    }

    async stopCoverage() {
        // Disable both JavaScript and CSS coverage
        const [jsCoverage, cssCoverage] = await Promise.all([
            page.coverage.stopJSCoverage(),
            page.coverage.stopCSSCoverage(),
        ]);
        let totalBytes = 0;
        let usedBytes = 0;
        const coverage = [...jsCoverage, ...cssCoverage];
        console.log({ coverage });
        for (const entry of coverage) {
          totalBytes += entry.text.length;
          for (const range of entry.ranges) usedBytes += range.end - range.start - 1;
        }
        console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`);
        pti.write(coverage, { includeHostname: true , storagePath: './.nyc_output' })
    }

    async beforeAllSteps(flow) {
      await super.beforeAllSteps(flow);
      await this.startCoverage();
      console.log('starting');
    }

    async beforeEachStep(step, flow) {
      await super.beforeEachStep(step, flow);
      console.log('before', step);
    }

    async afterEachStep(step, flow) {
      await super.afterEachStep(step, flow);
      console.log('after', step);
    }

    async afterAllSteps(flow) {
      await this.stopCoverage();
      await super.afterAllSteps(flow);
      console.log('done');
    }
}

export const flow = {
    "title": "ProjectTest",
    "steps": [
        {
            "type": "setViewport",
            "width": 1174,
            "height": 757,
            "deviceScaleFactor": 1,
            "isMobile": false,
            "hasTouch": false,
            "isLandscape": false
        },
        {
            "type": "navigate",
            "url": "http://localhost:3000/",
            "assertedEvents": [
                {
                    "type": "navigation",
                    "url": "http://localhost:3000/",
                    "title": "SporosDAO App"
                }
            ]
        },
        {
            "type": "waitForElement",
            "selectors": [
                "aria/SporosDAO"
            ]
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "aria/SporosDAO"
                ],
                [
                    "#root > div > main > div.MuiContainer-root.MuiContainer-maxWidthLg.css-1oifrf6 > div.MuiGrid-root.MuiGrid-container.css-1d3bbye > div:nth-child(2) > div > div:nth-child(2) > ul > li:nth-child(1) > a"
                ]
            ],
            "offsetX": 25.125,
            "offsetY": 17.3125
        },
        {
            "type": "click",
            "selectors": [
                [
                    "#root > div > div > div > nav > div:nth-child(4) > div.MuiListItemText-root.css-1tsvksn > span"
                ]
            ],
            "target": "main",
            "offsetX": 48,
            "offsetY": 11
        },
        {
            "type": "waitForElement",
            "selectors": [
                "#root > div > div > div > nav > div:nth-child(5) > div.MuiListItemText-root.css-1tsvksn > span"
            ]
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "#root > div > div > div > nav > div:nth-child(5) > div.MuiListItemText-root.css-1tsvksn > span"
                ]
            ],
            "offsetX": 49,
            "offsetY": 0
        },
        {
            "type": "waitForElement",
            "selectors": [
                "aria/My New Project June 3 2022"
            ]
        },
        {
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "aria/My New Project June 3 2022"
                ],
                [
                    "#root > div > main > div.MuiContainer-root.MuiContainer-maxWidthLg.css-1oifrf6 > div > div:nth-child(1) > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-container.css-11ngdyu > div:nth-child(1) > div > div.jss6 > a"
                ]
            ],
            "offsetX": 37,
            "offsetY": 11.1875
        },
        {
            "type": "navigate",
            "url": "https://deploy-preview-67--sporosdaoapp-dev.netlify.app/dao/b32b9ebb-b4b1-4d12-9e55-2aa62178cdf8/projects",
            "assertedEvents": [
                {
                    "type": "navigation",
                    "url": "https://deploy-preview-67--sporosdaoapp-dev.netlify.app/dao/b32b9ebb-b4b1-4d12-9e55-2aa62178cdf8/projects",
                    "title": "SporosDAO App"
                }
            ]
        }
    ],
    "timeout": 20000
};

export async function run(extension) {
  const runner = await createRunner(flow, extension);
  await runner.run();
}

if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    const extension = new CoverageExtension(browser, page, 7000)
    await run(extension);
  }
  
await browser.close();
      