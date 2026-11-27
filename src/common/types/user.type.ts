import { UserEnum } from "../../database/model/user.model";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string | undefined;
  age?: number | undefined;
  gender?: string | undefined;
  isVerified?: boolean;
  phone?: string;
  role?: UserEnum;
  googleId?: string | undefined;
  isPrivate?: boolean;
  avatar?: string;
  bio?: string;
  userName: string ;
}
