"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follow_service_1 = require("./follow.service");
const token_service_1 = require("../../common/service/token.service");
const success_response_1 = require("../../common/exceptions/success.response");
const router = (0, express_1.Router)();
const followService = new follow_service_1.FollowService();
router.post("/followUser", token_service_1.auth, async (req, res) => {
    const data = await followService.followUser(req.userId, req.body);
    (0, success_response_1.successResponse)({
        res,
        message: "user followed successfully",
        data,
    });
});
router.get("/findFollowers", token_service_1.auth, async (req, res) => {
    const data = await followService.getFollowers(req.userId);
    (0, success_response_1.successResponse)({
        res,
        message: "followers fetched successfully",
        data,
    });
});
router.get("/following", token_service_1.auth, async (req, res) => {
    const data = await followService.getFollowing(req.userId);
    (0, success_response_1.successResponse)({
        res,
        message: "following fetched successfully",
        data,
    });
});
router.delete("/unfollowUser", token_service_1.auth, async (req, res) => {
    const data = await followService.unfollowUser(req.userId, req.body);
    (0, success_response_1.successResponse)({
        res,
        message: "user unfollowed successfully",
        data,
    });
});
router.get("/suggestions", token_service_1.auth, async (req, res) => {
    const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : 10;
    const data = await followService.getSuggestions(req.userId, limit);
    (0, success_response_1.successResponse)({
        res,
        message: "suggestions fetched successfully",
        data,
    });
});
exports.default = router;
