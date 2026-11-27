import { Types } from "mongoose";

export interface IFollow {
  _id?: Types.ObjectId;
  followerId: Types.ObjectId | string;
  followingId: Types.ObjectId | string;
  createdAt?: Date;
}
