"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const success_response_1 = require("../../common/exceptions/success.response");
const user_service_1 = require("./user.service");
const token_service_1 = require("../../common/service/token.service");
const router = (0, express_1.Router)();
router.get("/get-user-by-id", token_service_1.auth, async (req, res) => {
    let data = await user_service_1.User.getUserById(req.userId);
    (0, success_response_1.successResponse)({
        res,
        message: "done",
        statusCode: 200,
        data,
    });
});
router.post("/verify-account", async (req, res) => {
    let data = await user_service_1.User.verifyAccount(req.body);
    (0, success_response_1.successResponse)({
        res,
        message: "USER VERIFIED",
        statusCode: 201,
        data,
    });
});
router.post("/resetPassword", async (req, res) => {
    let data = await user_service_1.User.resetPassword(req.body.email);
    (0, success_response_1.successResponse)({
        res,
        message: data,
        statusCode: 201,
    });
});
router.post("/confirmResetPassword", async (req, res) => {
    let data = await user_service_1.User.confirmResetPassword(req.body);
    (0, success_response_1.successResponse)({
        res,
        message: data,
        statusCode: 201,
    });
});
router.put("/changePrivateSetting", token_service_1.auth, async (req, res) => {
    let data = await user_service_1.User.changePrivateSetting(req.userId);
    (0, success_response_1.successResponse)({
        res,
        data,
        message: "user's private setting is updated!",
    });
});
router.put("/updateData", token_service_1.auth, async (req, res) => {
    let data = await user_service_1.User.updata(req.userId, req.body);
    (0, success_response_1.successResponse)({
        res,
        message: "user updated successfully",
        data,
    });
});
router.get("/searchUser", token_service_1.auth, async (req, res) => {
    const userName = req.query.userName;
    const data = await user_service_1.User.searchUser(req.userId, userName);
    (0, success_response_1.successResponse)({
        res,
        message: "Users fetched successfully",
        data,
    });
});
exports.default = router;
