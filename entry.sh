#!/bin/bash

if [ "$1" = "dev" ]; then
	docker-compose -f docker-compose.yml up --build -d
fi
if [ "$1" = "down" ]; then
	docker-compose -f docker-compose.yml down --rmi local
fi