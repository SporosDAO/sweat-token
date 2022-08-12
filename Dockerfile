FROM node:lts as deps

FROM deps as contracts
WORKDIR /app/contracts

FROM deps as backend
WORKDIR /app/backend

FROM deps as frontend
WORKDIR /app/frontend

# FROM cypress/base as e2e-tests
# WORKDIR /app/e2e-tests
