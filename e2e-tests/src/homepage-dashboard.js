
import url from 'url';
import { createRunner, PuppeteerRunnerExtension } from '@puppeteer/replay';
import pti from 'puppeteer-to-istanbul';
import puppeteer from 'puppeteer';
import { start } from 'repl';

/**
 *
 * A minimal initial e2e flow with puppeteer
 * generated and exported from Chrome DevTools
 *
 */

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
    "title": "SporosDAO App Home Page + Dashboard",
    "steps": [
        {
            "type": "setViewport",
            "width": 885,
            "height": 1304,
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
            "type": "click",
            "target": "main",
            "selectors": [
                [
                    "aria/Your DevCo DAOs"
                ]
            ],
            "offsetX": 282,
            "offsetY": 29.5625
        },
        {
            "type": "waitForElement",
            "target": "main",
            "frame": [],
            "selectors": [
                [
                    "aria/Create a DAO"
                ]
            ]
        },
        {
            "type": "waitForElement",
            "target": "main",
            "frame": [],
            "selectors": [
                [
                    "aria/Public DAOs"
                ]
            ]
        }
    ]
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
