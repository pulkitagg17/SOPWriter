.PHONY: install dev build test lint docker-up docker-down clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

typecheck:
	npm run typecheck

docker-up:
	docker-compose -f docker-compose.dev.yml up -d

docker-down:
	docker-compose -f docker-compose.dev.yml down

clean:
	rm -rf dist node_modules coverage
