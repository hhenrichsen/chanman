@echo off
docker-compose -f devops/docker-compose-dev.yml -p chanman down -v
rmdir /S /Q data\dev
rmdir /S /Q data\dev-migrations