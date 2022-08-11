#!/usr/bin/bash
set -evx

docker-compose run --rm e2e-tests src/daoTest.js

# to run e2e tests container in interactive mode use the following command
# docker-compose run --rm e2e-tests bash
