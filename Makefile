
FILE?=

frontend/dev:
	docker-compose up frontend

backend/dev:
	docker-compose up backend

backend/dev/test:
	docker-compose run -p 9229:9229 --rm backend yarn run test:debug -- ${FILE}

prod/build:
	docker build . -f Dockerfile.prod -t sweat-token:prod

prod/run:
	docker run --rm -it \
	-p 3001:3001 \
	-e MONGODB_URI=mongodb://172.17.0.1:27017/sweat-token-dev \
	-e JWT_SECRET="not so secret" \
	sweat-token:prod 

prod/sh:
	docker run --rm -it \
	-p 3001:3001 \
	-e MONGODB_URI=mongodb://172.17.0.1:27017/sweat-token-dev \
	-e JWT_SECRET="not so secret" \
	--entrypoint bash \
	sweat-token:prod