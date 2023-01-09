@echo off
docker-compose -f devops/docker-compose-dev.yml -p chanman up --build -d %*