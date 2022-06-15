import url from 'url';
import { createRunner, PuppeteerRunnerExtension } from '@puppeteer/replay';
import pti from 'puppeteer-to-istanbul';
import puppeteer from 'puppeteer';

// Note: Please run this test after creating a public DAO named SporosDao

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
    "title": "TestDao",
    "steps": [
        {
            "type": "setViewport",
            "width": 1051,
            "height": 757,
            "deviceScaleFactor": 1,
            "isMobile": false,
            "hasTouch": false,
            "isLandscape": false
        },
        {
            "type": "navigate",
            "url": "https://deploy-preview-67--sporosdaoapp-dev.netlify.app/",
            "assertedEvents": [
                {
                    "type": "navigation",
                    "url": "https://deploy-preview-67--sporosdaoapp-dev.netlify.app/",
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
                ]
            ],
            "offsetX": 66,
            "offsetY": 4.3125
        },
        {
            "type": "click",
            "selectors": [
                [
                    "aria/Dashboard"
                ]
            ],
            "target": "main",
            "offsetX": 115,
            "offsetY": 20
        },
        {
            "type": "click",
            "selectors": [
                [
                    "aria/Legal"
                ]
            ],
            "target": "main",
            "offsetX": 167,
            "offsetY": 44
        },
        {
            "type": "click",
            "selectors": [
                [
                    "aria/Taxes"
                ]
            ],
            "target": "main",
            "offsetX": 126,
            "offsetY": 37
        },
        {
            "type": "click",
            "selectors": [
                [
                    "aria/Equity"
                ]
            ],
            "target": "main",
            "offsetX": 60,
            "offsetY": 6
        }
    ],
    "timeout": 30000
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
      