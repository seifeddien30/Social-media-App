import { Router, type Request, type Response } from "express";
import { successResponse } from "../../common/exceptions/success.response";
import { User } from "./user.service";
import { auth } from "../../common/service/token.service";
import { IUser } from "../../common/types/user.type";

const router = Router();
router.get(
  "/get-user-by-id",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    let data = await User.getUserById(req.userId as string);
    successResponse({
      res,
      message: "done",
      statusCode: 200,
      data,
    });
  },
);
router.post(
  "/verify-account",
  async (req: Request, res: Response): Promise<void> => {
    let data = await User.verifyAccount(req.body);
    successResponse({
      res,
      message: "USER VERIFIED",
      statusCode: 201,
      data,
    });
  },
);
router.post("/resetPassword", async (req: Request, res: Response) => {
  let data = await User.resetPassword(req.body.email);
  successResponse({
    res,
    message: data,
    statusCode: 201,
  });
});
router.post("/confirmResetPassword", async (req: Request, res: Response) => {
  let data = await User.confirmResetPassword(req.body);
  successResponse({
    res,
    message: data,
    statusCode: 201,
  });
});
router.put(
  "/changePrivateSetting",
  auth,
  async (req: Request, res: Response) => {
    let data = await User.changePrivateSetting(req.userId as string);
    successResponse({
      res,
      data,
      message: "user's private setting is updated!",
    });
  },
);
router.put("/updateData", auth, async (req: Request, res: Response) => {
  let data = await User.updata(req.userId as string, req.body as IUser);
  successResponse({
    res,
    message: "user updated successfully",
    data,
  });
});
router.get("/searchUser", auth, async (req: Request, res: Response) => {
  const userName = req.query.userName as string;
  const data = await User.searchUser(req.userId as string, userName);

  successResponse({
    res,
    message: "Users fetched successfully",
    data,
  });
});
export default router;
