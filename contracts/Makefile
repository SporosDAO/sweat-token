.PHONY: test build

NETWORK?=hardhat

node:
	pnpm hardhat node

build:
	pnpm hardhat compile

test:
	pnpm hardhat test

test/watch:
	pnpm hardhat watch test

deploy/clean:
	rm -f build/contracts.json

deploy/script:
	mkdir -p ./build
	npx hardhat run --network $(NETWORK) scripts/$(SCRIPT).deploy.ts
	sleep 1
