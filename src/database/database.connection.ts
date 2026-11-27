import mongoose from "mongoose";
import { env } from "../config/env.service";

export const databaseConnection = () => {
  mongoose
    .connect(env.databaseUrl)
    .then(() => {
      console.log("Data Base connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
