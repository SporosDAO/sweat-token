#!/usr/bin/bash
set -evx
# shutdown any leftover containers from a previous session
docker-compose down
# update install deps
# docker-compose -f docker-compose.yaml -f docker-compose.install.yaml --profile install up --no-deps
# start app modules
docker-compose up -d backend
# set API path
gp ports await 3001 && \
export REACT_APP_SWEAT_TOKEN_API_BASEPATH=$(gp url 3001)
docker-compose up -d frontend
# change owner of files to gitpod
# fixes problems when some files are installed as root by docker scripts
sudo chown -hR gitpod.gitpod backend/node_modules/
cd backend && yarn install && cd -
sudo chown -hR gitpod.gitpod frontend/node_modules/
cd frontend && yarn install && cd -
sudo chown -hR gitpod.gitpod e2e-tests/node_modules/
cd e2e-tests && yarn install && cd -
sudo chown -hR gitpod.gitpod contracts/node_modules/
cd contracts && yarn install && cd -
# checkout kali contracts for integration testing
git clone https://github.com/kalidao/kali-contracts.git
