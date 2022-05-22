
FILE?=

frontend/dev:
	docker-compose up frontend

backend/dev:
	docker-compose up backend

backend/dev/test:
	docker-compose run -p 9229:9229 --rm backend yarn run test:debug -- ${FILE}