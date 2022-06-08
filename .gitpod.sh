#!/usr/bin/bash
# clean up any previously started and dangling containers
docker-compose down
# update install deps
docker-compose -f docker-compose.yaml -f docker-compose.install.yaml --profile install up --no-deps
# start app modules
docker-compose up -d backend
# set API path
gp await-port 3001 && \
export REACT_APP_SWEAT_TOKEN_API_BASEPATH=$(gp url 3001)
docker-compose up -d frontend
# change owner of files to gitpod
# fixes problems when some files are installed as root by docker scripts
sudo chown -hR gitpod.gitpod frontend/node_modules/
sudo chown -hR gitpod.gitpod backend/node_modules/
