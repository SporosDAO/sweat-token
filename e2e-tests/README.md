# E2E Full Stack Testsuite

This repo hosts e2e tests based on [Synpress](https://github.com/Synthetixio/synpress).

_Note_: E2E tests require the full SporosDAO App stack to be running: frontend, backend, smart contracts and database. All are available via `docker-compose.yaml` at the root of the monorepo.

## Gitpod Environment

This repo is prepared for Gitpod deployment with Synpress pre-installed and ready to run. Read more [here](https://github.com/mikenikles/cypress-on-gitpod).

## CI runs

All tests in this repo run as CI checks on pull request and push. See [Github Action Workflow file](../.github/workflows/e2e-tests.yml)

## Environment variables

Install globally [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) for parsing `.env` files
```bash
yarn global add dotenv
export PATH=$PATH:"$(yarn global bin)"
```

Synpress expects `PRIVATE_KEY` environment variable to be used for initializing a Metamask test account. You can add it to `.env` or `.env.local`. See `.env.example`.

## Available Scripts

In the project directory, you can run:

### `yarn install`

Install all third party dependencies.

### `yarn test`

Before running tests, the full app stack needs to be running on localhost via
`compose-docker up` from the main directory.

Then run e2e tests via `yarn test`.

__NOTE__: In Gitpod environment, the Synpress/Cypress interactive browser window is available via web service on port `6080`. You can watch the simulated user actions in the browser as tests are running.


### `yarn coverage`

After running tests, run this command to see coverage reporting.

## Troubleshooting

E2E test runs record logs, screenshots and videos of test interactions with the app.

### Screenshots

Screenshots of failing tests are saved in `tests/e2e/screenshots` and look like the example below:

![Project Management -- Sporos DAO App Projects Pages -- Should show DAO PMTest projects for account 0xf952a72F39c5Fa22a443200AbE7835128bCb7439 (failed)](https://user-images.githubusercontent.com/2234901/185227458-13898c89-8e13-41c0-96a5-deca194c94fe.png)

### Videos

Videos of failing tests are saved in `tests/e2e/videos` and look like the example below:

https://user-images.githubusercontent.com/2234901/185227575-de0621bc-af7d-4fd0-8650-40d2b84dbc29.mp4

### CI Artifacts

When tests run within github actions, the resulting screenshots and videos are saved as workflow run artifacts. See example below:

![Screen Shot 2022-08-17 at 2 31 58 PM](https://user-images.githubusercontent.com/2234901/185227760-9c7ba623-4cd0-475c-b2a5-6adfd26ed2db.png)

