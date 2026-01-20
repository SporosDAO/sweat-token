#!/usr/bin/bash
set -evx

# Runs puppeteer tests via docker container with pre-installed chrome
docker-compose run --rm e2e-tests bash synpress-run.sh

# To run a single test file
# docker-compose run --rm e2e-tests src/daoTest.js

# To run in interactive mode
# docker-compose run --rm e2e-tests bash
