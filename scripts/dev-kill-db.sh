docker-compose -f devops/docker-compose-dev.yml -p chanman down -v
rm -rf data/dev
rm -rf data/dev-migrations