// Set up reflection
import "reflect-metadata";

// Load environment
import { config as loadEnv } from "dotenv";
loadEnv();

import Container from "typedi";
import { BotInitializer } from "./BotInitializer";
import Logger, { createLogger } from "bunyan";

Container.set(
    Logger,
    createLogger({
        name: "bot",
        stream: process.stdout,
        level: process.env.NODE_ENV == "production" ? "info" : "debug",
    }),
);

Container.get(BotInitializer).init();
