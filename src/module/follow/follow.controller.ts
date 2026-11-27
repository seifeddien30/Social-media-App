import { Router, Request, Response } from "express";
import { FollowService } from "./follow.service";
import { auth } from "../../common/service/token.service";
import { successResponse } from "../../common/exceptions/success.response";

const router = Router();
const followService = new FollowService();

router.post("/followUser", auth, async (req: Request, res: Response) => {
  const data = await followService.followUser(
    req.userId as string,
    req.body as string,
  );
  successResponse({
    res,
    message: "user followed successfully",
    data,
  });
});

router.get("/findFollowers", auth, async (req: Request, res: Response) => {
  const data = await followService.getFollowers(req.userId as string);
  successResponse({
    res,
    message: "followers fetched successfully",
    data,
  });
});

router.get("/following", auth, async (req: Request, res: Response) => {
  const data = await followService.getFollowing(req.userId as string);
  successResponse({
    res,
    message: "following fetched successfully",
    data,
  });
});
router.delete("/unfollowUser", auth, async (req: Request, res: Response) => {
  const data = await followService.unfollowUser(req.userId as string, req.body);

  successResponse({
    res,
    message: "user unfollowed successfully",
    data,
  });
});
router.get("/suggestions", auth, async (req: Request, res: Response) => {
  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

  const data = await followService.getSuggestions(req.userId as string, limit);

  successResponse({
    res,
    message: "suggestions fetched successfully",
    data,
  });
});
export default router;
