import { Schema, model, Types } from "mongoose";
import { IFollow } from "../../common/types/follow.type";

const followSchema = new Schema<IFollow>(
  {
    followerId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    followingId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const FollowModel = model<IFollow>("Follow", followSchema);
