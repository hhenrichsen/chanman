import { Token } from "typedi";
import { EntitySchema } from "typeorm";

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
export const EntityToken = new Token<string | Function | EntitySchema<any>>(
    "entities",
);
/* eslint-enable */
