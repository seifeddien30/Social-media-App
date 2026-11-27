import express from "express";
import cors from "cors";
import authRouter from "./module/auth/auth.controller";
import { globalErrorHandling } from "./common/utility/error";
import { env } from "./config/env.service";
import { databaseConnection } from "./database/database.connection";
import { redisService } from "./common/service/redis.service";
import userRouter from "./module/user/user.controller";
import followRouter from "./module/follow/follow.controller";
export const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/follow", followRouter);
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
databaseConnection();
redisService.connect();
app.use(globalErrorHandling);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
