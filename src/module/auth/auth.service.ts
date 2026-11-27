import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../common/exceptions/error.exception";
import {
  compareHash,
  generateHash,
} from "../../common/service/encreption.service";
import { verifyGoogleIdToken } from "../../common/service/google.service";
import { redisService } from "../../common/service/redis.service";
import { sendEmail } from "../../common/service/sendEmail.service";
import {
  generateAccessToken,
  generateToken,
} from "../../common/service/token.service";
import { IUser } from "../../common/types/user.type";
import { userModel } from "../../database/model/user.model";
import { DatabaseRepository } from "../../database/reposaiory/database.reposatory";
import { LoginResponse, SignupResponse } from "./dto/auth.dto";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { HydratedDocument } from "mongoose";

class AuthService {
  private authRepository: DatabaseRepository<IUser>;
  constructor() {
    this.authRepository = new DatabaseRepository<IUser>(userModel);
  }

  public async login(data: IUser): Promise<LoginResponse> {
    let { email, password } = data;
    let existedUser = await this.authRepository.findOne({ filter: { email } });
    if (!existedUser) {
      throw new NotFoundException("User not found");
    }
    if (!password || !existedUser.password) {
      throw new BadRequestException("Password is required");
    }
    let passwordMatched = await compareHash({
      planText: password,
      hashedPassword: existedUser.password,
    });
    if (!passwordMatched) {
      throw new BadRequestException("password not matched");
    }
    let { token, refreshToken } = generateToken(existedUser);
    return {
      message: "Login successful",
      data: { token, refreshToken },
    };
  }
  public async signup(data: IUser): Promise<SignupResponse> {
    let {
      phone,
      email,
      name,
      password,
      userName,
      confirmPassword,
      age,
      gender,
    } = data;
    if (!password || !confirmPassword) {
      throw new BadRequestException("Password and confirmation are required");
    }
    if (!phone) {
      throw new BadRequestException("Phone is required");
    }
    if (password !== confirmPassword) {
      throw new BadRequestException("confirmPassword is not matched");
    }
    let existedUser = await this.authRepository.findOne({ filter: { email } });
    if (existedUser) {
      throw new ConflictException("User already exists");
    }
    let checkUserName = await this.authRepository.findOne({
      filter: { userName },
    });
    if (checkUserName) {
      throw new ConflictException("someone has the same user name");
    }
    let hashedPassword = await generateHash({ planText: password });
    if (!hashedPassword) {
      throw new BadRequestException("something went wrong");
    }
    let otp = Math.round(Math.random() * 1000000);
    let user = await this.authRepository.create({
      email,
      name,
      password: hashedPassword,
      age,
      phone,
      gender,
      userName,
    });
    await redisService.set(`otp::${user._id}`, otp, 5 * 60);
    await sendEmail({
      to: `${user.email}`,
      subject: "Verify your email",
      html: `<h1>Your OTP is ${otp}</h1>`,
    });
    return {
      message: "Signup successful",
      data: { email, name, age, gender, phone },
    };
  }

  public async refreshToken(body: { refreshToken?: string }) {
    let { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is required");
    }

    const newToken = await generateAccessToken(refreshToken);

    if (!newToken) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    return { token: newToken };
  }
  public async googleLogin(idToken: string) {
    const googleUser = await verifyGoogleIdToken(idToken);

    let user: HydratedDocument<IUser> | IUser | null =
      await this.authRepository.findOne({
        filter: { email: googleUser.email },
      });

    if (!user) {
      if (!googleUser.name) {
        throw new BadRequestException("Google account name is missing");
      }

      const hashedPassword = await bcrypt.hash(crypto.randomUUID(), 10);

      const newUserData: IUser = {
        email: googleUser.email,
        name: googleUser.name,
        password: hashedPassword,
        googleId: googleUser.googleId,
        ...(googleUser.emailVerified !== undefined
          ? { isVerified: googleUser.emailVerified }
          : {}),
        role: 1,
        userName: googleUser.name,
      };

      user = await this.authRepository.create(newUserData);
    }

    if (!user) {
      throw new BadRequestException("Unable to authenticate with Google");
    }

    if (!user._id) {
      throw new BadRequestException("User ID is missing");
    }
    if (user.role === undefined) {
      throw new BadRequestException("User role is missing");
    }

    const tokens = generateToken({ _id: user._id, role: user.role });

    return {
      user,
      ...tokens,
    };
  }
}

export const authService = new AuthService();
