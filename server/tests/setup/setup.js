// tests/setup/setup.js

import supertest from "supertest";
import createApp from "../../src/app.js";
import connectToDB from "../../src/db/db.js";
import env from "../../src/config/env.js";

await connectToDB(env.MONGO_URI);

global.request = supertest;
global.app = createApp();