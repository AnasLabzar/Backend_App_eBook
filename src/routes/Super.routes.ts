import { cute } from "@utils";
import { Router } from "express";
import { ISuper, Super } from "@models";
import { or } from "@middlewares";
import { isSuper } from "middlewares/profiles";

const router = Router();

router.post(
  "/register",
  or(isSuper),
  cute(async (req, res, next) => {
    const user: ISuper = (await Super.create(req.body)).toObject();
    delete user.password;

    //response
    res.json(user);
  })
);

export { router as SuperRoutes };
