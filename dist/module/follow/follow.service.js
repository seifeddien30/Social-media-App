"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const mongoose_1 = require("mongoose");
const error_exception_1 = require("../../common/exceptions/error.exception");
const follow_model_1 = require("../../database/model/follow.model");
const user_model_1 = require("../../database/model/user.model");
const database_reposatory_1 = require("../../database/reposaiory/database.reposatory");
class FollowService {
    userRepo = new database_reposatory_1.DatabaseRepository(user_model_1.userModel);
    followRepo = new database_reposatory_1.DatabaseRepository(follow_model_1.FollowModel);
    normalizeUserId(input) {
        if (typeof input === "object" && input !== null && "userId" in input) {
            return String(input.userId ?? "").trim();
        }
        return typeof input === "string" ? input.trim() : "";
    }
    async followUser(followerId, rawFollowingId) {
        const cleanFollowerId = this.normalizeUserId(followerId);
        const followingId = this.normalizeUserId(rawFollowingId);
        if (!followingId || !mongoose_1.Types.ObjectId.isValid(followingId)) {
            throw new error_exception_1.BadRequestException("invalid following user id");
        }
        if (cleanFollowerId === followingId) {
            throw new error_exception_1.BadRequestException("you cannot follow yourself idiot");
        }
        const targetUser = await this.userRepo.findOne({
            filter: { _id: followingId },
        });
        if (!targetUser) {
            throw new error_exception_1.NotFoundException("user not found");
        }
        const existingFollow = await this.followRepo.findOne({
            filter: { followerId: cleanFollowerId, followingId },
        });
        if (existingFollow) {
            throw new error_exception_1.ConflictException("you already follow this user");
        }
        const follow = await this.followRepo.create({
            followerId: cleanFollowerId,
            followingId,
        });
        return follow;
    }
    async getFollowers(userId) {
        const followers = await this.followRepo.findAll({
            filter: { followingId: userId },
            populate: {
                path: "followerId",
                select: "name userName avatar bio",
            },
        });
        return followers;
    }
    async getFollowing(userId) {
        const following = await this.followRepo.findAll({
            filter: { followerId: userId },
            populate: {
                path: "followingId",
                select: "name userName avatar bio",
            },
        });
        return following;
    }
    async unfollowUser(followerId, rawFollowingId) {
        const cleanFollowerId = this.normalizeUserId(followerId);
        const followingId = this.normalizeUserId(rawFollowingId);
        if (!followingId || !mongoose_1.Types.ObjectId.isValid(followingId)) {
            throw new error_exception_1.BadRequestException("invalid following user id");
        }
        if (cleanFollowerId === followingId) {
            throw new error_exception_1.BadRequestException("you cannot unfollow yourself");
        }
        const existingFollow = await this.followRepo.findOne({
            filter: { followerId: cleanFollowerId, followingId },
        });
        if (!existingFollow) {
            throw new error_exception_1.NotFoundException("you are not following this user");
        }
        await this.followRepo.deleteOne({
            filter: { followerId: cleanFollowerId, followingId },
        });
        return { unfollowedUserId: followingId };
    }
    async getSuggestions(userId, limit = 10) {
        const cleanUserId = this.normalizeUserId(userId);
        if (!cleanUserId || !mongoose_1.Types.ObjectId.isValid(cleanUserId)) {
            throw new error_exception_1.BadRequestException("invalid user id");
        }
        const safeLimit = limit > 0 ? Math.min(limit, 50) : 10;
        const followingRecords = await this.followRepo.findAll({
            filter: { followerId: cleanUserId },
        });
        const excludedIds = [cleanUserId];
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
exports.FollowService = FollowService;
