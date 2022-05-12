.PHONY: test build

NETWORK?=hardhat

node:
	yarn hardhat node

build:
	yarn hardhat compile

test:
	yarn hardhat test

test/watch:
	yarn hardhat watch test

deploy/clean:
	rm -f build/contracts.json

deploy/script:
	mkdir -p ./build
	npx hardhat run --network $(NETWORK) scripts/$(SCRIPT).deploy.ts
	sleep 1
