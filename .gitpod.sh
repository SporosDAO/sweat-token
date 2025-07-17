#!/usr/bin/bash
set -evx
# shutdown any leftover containers from a previous session
docker-compose down
# update install deps
# docker-compose -f docker-compose.yaml -f docker-compose.install.yaml --profile install up --no-deps
# start app modules
docker-compose up -d frontend
