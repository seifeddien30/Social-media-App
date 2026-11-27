import mongoose from "mongoose";
import { IUser } from "../../common/types/user.type";
import { boolean, string } from "zod";

export enum UserEnum {
  Admin,
  User,
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  age: {
    type: String,
  },
  isVerified: {
    type: boolean,
    default: false,
  },
  role: {
    type: Number,
    enum: UserEnum,
    default: UserEnum.User,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
});

export const userModel = mongoose.model<IUser>("user", userSchema);
