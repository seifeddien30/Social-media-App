import { env } from "../../config/env.service";
import bcrypt from "bcrypt";
export const generateHash = async ({
  planText,
  salt = env.salt,
}: {
  planText: string;
  salt?: string;
}) => {
  let hashData = await bcrypt.hash(planText, Number(salt));
  return hashData;
};
export const compareHash = async ({
  planText,
  hashedPassword,
}: {
  planText: string;
  hashedPassword: string;
}) => {
  let isValidPassword = await bcrypt.compare(planText, hashedPassword);
  return isValidPassword;
};
