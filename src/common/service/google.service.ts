import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.service";
import { BadRequestException } from "../exceptions/error.exception";

const clint = new OAuth2Client(env.google);

export const verifyGoogleIdToken = async (idToken: string) => {
  if (!idToken) {
    throw new BadRequestException("Google idToken is required");
  }

  const ticket = await clint.verifyIdToken({
    idToken,
    audience: env.google,
  });
  const payLoad = ticket.getPayload();
  if (!payLoad || !payLoad.email) {
    throw new BadRequestException("Invalid Google token payload");
  }
  return {
    email: payLoad.email,
    name: payLoad.name,
    googleId: payLoad.sub,
    picture: payLoad.picture,
    emailVerified: payLoad.email_verified,
  };
};
