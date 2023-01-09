# Sophisticated Discord Bot Example
I wrote this example because many of the discord bot examples that I've seen
online prioritize functionality over maintainability. I wanted to provide an
alternative; that's what I'm doing here.

## Getting Started
* Install Docker and Docker Compose (Node is not required; that's handled by
Docker)
* Register a discord bot application.
  * https://discord.com/developers/applications 
  * Sign in to your discord account
  * Create new application
    * Make note of Application ID
  * Create new Bot
    * Make note of Token (May need to click `Reset Token` to generate a new token)
* Copy `.env.example` to `.env` and fill in the required values with the information from above.
* Run `./scripts/dev.sh` or `./scripts/dev.cmd`.
* You're done.

## Development Mode
You can get into development mode by running `./scripts/dev.sh` or
`./scripts/dev.cmd`.

Development mode provides you with many useful features. It will hot-reload
based on code changes outside of the container, and keeps the database in
sync with the current state of the codebase.

Development mode also includes a replica of the production schema which makes
it easy to see the current state of migrations, and is used to generate new
ones without worrying about touching production data.

## Moving to Production Mode
Once you're ready to move to production mode, you'll want to do a couple quick
steps in development mode:

1. Run `./scripts/dev-npm.sh run generate --name=migration_name`. This will generate migrations based
on the current state of your models folder.
2. Run `./scripts/prod.sh`. Congrats, you're now running in production mode.

## Available Utilities

### Adminer
You can inspect the database as it's running by going to `localhost:8080`. If
you already have something running on that port, you can change that in the 
`devops/docker-compose-dev.yml` folder under the `adminer` service.

Once you've reached that page, you can log into the database to inspect it.

## How do I...

### Update the Database on production?
`./scripts/dev-npm.sh run generate` to create a migration in development mode.
This is used in production mode to set up and update the database.

### Format the code?
`./scripts/dev-npm.sh run format`

### View the logs?
`./scripts/dev-logs.sh`

### Add dependencies without node?
`./scripts/dev-npm.sh install lodash`
