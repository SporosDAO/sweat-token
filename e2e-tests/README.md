# E2E Full Stack Testsuite

This repo hosts e2e tests based on puppeteer and Chrome DevTools [Recorder](https://developer.chrome.com/docs/devtools/recorder/).

_Note_: E2E tests require the full SporosDAO App stack to be running: frontend, backend, smart contracts and database.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Install all third party dependencies.

### `yarn test`

Before running tests, the full app stack needs to be running on localhost via
`compose-docker up` from the main directory.

Then run e2e tests via `yarn test`.

### `yarn coverage`

After running tests, run this command to see coverage reporting.
