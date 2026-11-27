import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env.service";
import {
  BadRequestException,
  UnauthorizedException,
} from "../exceptions/error.exception.js";
import {
  type NextFunction,
  type Response,
  type Request,
  type RequestHandler,
} from "express";
import { IUser } from "../types/user.type.js";
import { IReq } from "../types/req.type";

export const auth: RequestHandler = (
  req: IReq,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new UnauthorizedException("token not found");
  }

  const [flag, token] = authorization.split(" ");
  if (!token) {
    throw new BadRequestException("Invalid authorization header");
  }
  switch (flag) {
    case "Basic":
      const basicData = Buffer.from(token, "base64").toString();
      let [email, password] = basicData.split(":");
      req.user = { email, password };
      next();
      break;
    case "Bearer":
      let decodedData = jwt.decode(token);
      if (!decodedData || typeof decodedData !== "object") {
        throw new BadRequestException("Invalid token");
      }
      let signature: string = "";
      switch (decodedData.aud) {
        case env.adminAud:
          signature = env.adminTokenKey;
          break;
        case env.userAud:
          signature = env.userTokenKey;
          break;
      }
      if (!signature) {
        throw new BadRequestException("Invalid token audience");
      }
      const decoded = jwt.verify(token, signature) as JwtPayload;
      if (decoded) {
        req.userId = decoded.id;
        next();
      } else {
        throw new BadRequestException("Invalid token");
      }
      break;
    default:
      throw new BadRequestException("Invalid authorization type");
  }
};

export const generateToken = (user: Pick<IUser, "role"> & { _id: unknown }) => {
  switch (user.role) {
    case 0: {
      let token = jwt.sign({ id: user._id }, env.adminTokenKey, {
        expiresIn: "1h",
        audience: env.adminAud,
      });
      let refreshToken = jwt.sign({ id: user._id }, env.adminRefreshTokenKey, {
        expiresIn: "1y",
        audience: env.adminAud,
      });
      return { token, refreshToken };
    }

    case 1: {
      let userToken = jwt.sign({ id: user._id }, env.userTokenKey, {
        expiresIn: "1h",
        audience: env.userAud,
      });
      let userRefreshToken = jwt.sign(
        { id: user._id },
        env.userRefreshTokenKey,
        {
          expiresIn: "1y",
          audience: env.userAud,
        },
      );
      return { token: userToken, refreshToken: userRefreshToken };
    }

    default:
      throw new Error(`Invalid or missing user role: ${user.role}`);
  }
};

export const generateAccessToken = (token: string) => {
  let decodedData = jwt.decode(token) as JwtPayload;
  if (!decodedData || !decodedData.aud) {
    throw new BadRequestException("Invalid token structure");
  }

  let refreshSignature: string;
  let accessSignature: string;

  switch (decodedData.aud) {
    case env.adminAud:
      refreshSignature = env.adminRefreshTokenKey;
      accessSignature = env.adminTokenKey;
      break;
    case env.userAud:
      refreshSignature = env.userRefreshTokenKey;
      accessSignature = env.userTokenKey;
      break;
    default:
      throw new BadRequestException("Invalid token audience");
  }
  let decoded = jwt.verify(token, refreshSignature) as JwtPayload;

  let newToken = jwt.sign({ id: decoded.id }, accessSignature, {
    expiresIn: "30m",
    audience: decodedData.aud,
  });

  return newToken;
};
