"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowModel = void 0;
const mongoose_1 = require("mongoose");
const followSchema = new mongoose_1.Schema({
    followerId: {
        type: mongoose_1.Types.ObjectId,
        ref: "user",
        required: true,
    },
    followingId: {
        type: mongoose_1.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
exports.FollowModel = (0, mongoose_1.model)("Follow", followSchema);
