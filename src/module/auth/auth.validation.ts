import z from "zod";

export const signupSchema = {
  body: z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
      age: z.number().min(18).max(90),
      phone:z.string()
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "confirmPassword doesn't match",
          path: ["confirmPassword"],
        });
      }
    }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};
