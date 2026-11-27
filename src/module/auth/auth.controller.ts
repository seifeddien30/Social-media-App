import type { Request, Response } from "express";
import { Router } from "express";
import { authService } from "./auth.service";
import { successResponse } from "../../common/exceptions/success.response";
import { loginSchema, signupSchema } from "./auth.validation";
import { validation } from "../../common/service/validation.service";

const router = Router();
router.post(
  "/login",
  validation(loginSchema),
  async (req: Request, res: Response): Promise<void> => {
    let data = await authService.login(req.body);
    successResponse({
      res,
      message: "Login successful",
      statusCode: 200,
      data,
    });
  },
);
router.post(
  "/signup",
  validation(signupSchema),
  async (req: Request, res: Response): Promise<void> => {
    let data = await authService.signup(req.body);
    successResponse({
      res,
      message: "Signup successful",
      statusCode: 201,
      data,
    });
  },
);

router.post("/refreshToken", async (req: Request, res: Response) => {
  const data = await authService.refreshToken(req.body);

  successResponse({
    res,
    message: "new token is generated",
    data,
  });
});

router.post("/google", async (req: Request, res: Response) => {
  const { idToken } = req.body;
  const data = await authService.googleLogin(idToken);

  successResponse({
    res,
    message: "Logged in with Google successfully",
    statusCode: 200,
    data,
  });
});

export default router;


