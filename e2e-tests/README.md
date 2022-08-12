# E2E Full Stack Testsuite

This repo hosts e2e tests based on [Synpress](https://github.com/Synthetixio/synpress).

_Note_: E2E tests require the full SporosDAO App stack to be running: frontend, backend, smart contracts and database. All are available via `docker-compose.yaml` at the root of the monorepo.

## Gitpod Environment

This repo is prepared for Gitpod deployment with Synpress pre-installed and ready to run. Read more [here](https://github.com/mikenikles/cypress-on-gitpod).

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
