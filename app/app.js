import express from "express";
import { PORT, SESSION_SECRET_KEY, APP_URL, REDIS_URL} from "./config/env.js";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";
import connectToDatabase from "./database/mongodb.js";
import session from "express-session";
import AuthRouter from "./routes/auth.routes.js";
import setupSwagger from "./swagger/swagger.js";
import adminRouter from "./routes/admin.routes.js";
import { createClient } from "redis";
import { RedisStore } from "connect-redis"; 



const app = express();
setupSwagger(app);
app.use(express.json());
app.use(cors());
const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(loggingMiddleware);

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.connect().catch(console.error);
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

let redisStore = new RedisStore({ client: redisClient, prefix: "session:" });

app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 },
  })
);

process.on("SIGINT", async () => {
  console.log("Disconnecting from Redis...");
  await redisClient.quit();
  console.log("Disconnected from Redis");
  process.exit(0);
});


app.get("/api", (req, res) => {
  res.send("Welcome to the Express.js API!");
});

app.use("/api/users", usersRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT || 3000}`);
  console.log(`App URL: ${APP_URL}/api`);

  connectToDatabase();
});


