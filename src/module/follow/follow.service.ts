import { Types } from "mongoose";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/error.exception";
import { IFollow } from "../../common/types/follow.type";
import { IUser } from "../../common/types/user.type";
import { FollowModel } from "../../database/model/follow.model";
import { userModel } from "../../database/model/user.model";
import { DatabaseRepository } from "../../database/reposaiory/database.reposatory";

export class FollowService {
  private readonly userRepo = new DatabaseRepository<IUser>(userModel);
  private readonly followRepo = new DatabaseRepository<IFollow>(FollowModel);
  private normalizeUserId(input: unknown): string {
    if (typeof input === "object" && input !== null && "userId" in input) {
      return String((input as { userId: unknown }).userId ?? "").trim();
    }
    return typeof input === "string" ? input.trim() : "";
  }

  public async followUser(followerId: string, rawFollowingId: unknown) {
    const cleanFollowerId = this.normalizeUserId(followerId);
    const followingId = this.normalizeUserId(rawFollowingId);

    if (!followingId || !Types.ObjectId.isValid(followingId)) {
      throw new BadRequestException("invalid following user id");
    }

    if (cleanFollowerId === followingId) {
      throw new BadRequestException("you cannot follow yourself idiot");
    }

    const targetUser = await this.userRepo.findOne({
      filter: { _id: followingId },
    });

    if (!targetUser) {
      throw new NotFoundException("user not found");
    }

    const existingFollow = await this.followRepo.findOne({
      filter: { followerId: cleanFollowerId, followingId },
    });

    if (existingFollow) {
      throw new ConflictException("you already follow this user");
    }

    const follow = await this.followRepo.create({
      followerId: cleanFollowerId,
      followingId,
    } as IFollow);

    return follow;
  }

  public async getFollowers(userId: string) {
    const followers = await this.followRepo.findAll({
      filter: { followingId: userId },
      populate: {
        path: "followerId",
        select: "name userName avatar bio",
      },
    });

    return followers;
  }

  public async getFollowing(userId: string) {
    const following = await this.followRepo.findAll({
      filter: { followerId: userId },
      populate: {
        path: "followingId",
        select: "name userName avatar bio",
      },
    });

    return following;
  }
  public async unfollowUser(followerId: string, rawFollowingId: unknown) {
    const cleanFollowerId = this.normalizeUserId(followerId);
    const followingId = this.normalizeUserId(rawFollowingId);

    if (!followingId || !Types.ObjectId.isValid(followingId)) {
      throw new BadRequestException("invalid following user id");
    }

    if (cleanFollowerId === followingId) {
      throw new BadRequestException("you cannot unfollow yourself");
    }

    const existingFollow = await this.followRepo.findOne({
      filter: { followerId: cleanFollowerId, followingId },
    });

    if (!existingFollow) {
      throw new NotFoundException("you are not following this user");
    }

    await this.followRepo.deleteOne({
      filter: { followerId: cleanFollowerId, followingId },
    });

    return { unfollowedUserId: followingId };
  }
  public async getSuggestions(userId: string, limit = 10) {
    const cleanUserId = this.normalizeUserId(userId);

    if (!cleanUserId || !Types.ObjectId.isValid(cleanUserId)) {
      throw new BadRequestException("invalid user id");
    }

    const safeLimit = limit > 0 ? Math.min(limit, 50) : 10;

    const followingRecords = await this.followRepo.findAll({
      filter: { followerId: cleanUserId },
    });

    const excludedIds: string[] = [cleanUserId];

    for (const record of followingRecords) {
      if (record.followingId) {
        excludedIds.push(record.followingId.toString());
      }
    }

    console.log({
      cleanUserId,
      followingCount: followingRecords.length,
      excludedIds,
    });

    const suggestions = await this.userRepo
      .findAll({
        filter: {
          _id: { $nin: excludedIds },
        },
        select: "name userName avatar bio isPrivate",
      })
      .limit(safeLimit);

    console.log({ suggestionsCount: suggestions.length });

    return suggestions;
  }
}
