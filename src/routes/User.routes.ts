import { checkPassword } from "@lib";
import { cute } from "@utils";
import { Router } from "express";
import { Genre, IUser, User } from "@models";
import { isAdmin, isAuthenticated, isSuper } from "middlewares/profiles";
import { or } from "middlewares/operators";

const router = Router();

// get all books
// router.get(
//   "/all",
//   or(isAdmin, isSuper, isAuthenticated),
//   cute(async (req, res) => {
//     const users = await User.find().populate("author genre");
//     res.json(users);
//   })
// );

router.post(
  "/register",
  cute(async (req, res, next) => {
    const user: IUser = (await User.create(req.body)).toObject();
    delete user.password;

    //response
    res.json(user);
  })
);

export { router as UserRoutes };
