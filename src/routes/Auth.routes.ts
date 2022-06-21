//@ts-nocheck
import { Router } from "express";
import { Super, Admin, User } from "@models";
import { checkPassword, generateToken, randomToken } from "@lib";
import { cute } from "@utils";

const router = Router();

const roles = {
  SUPER: {
    model: Super,
    secret: () => process.env.JWT_SECRET,
  },
  ADMIN: {
    model: Admin,
    secret: () => process.env.JWT_ADMIN,
  },
  USER: {
    model: User,
    secret: () => process.env.JWT_SECRET,
  },
} as { [key: string]: { model: any; secret: Function } };

router.get(
  "/token",
  cute(async (req, res, next) => {
    if (!req.headers.authorization) throw new Error("no token");
    const { id, role: UserRole } = randomToken(
      req.headers.authorization.split(" ")[1]
    );
    // @ts-ignore
    const { model, secret } = roles[UserRole];
    const user = await model.findById(id).select("-password");
    res.json({
      data: {
        user: user,
        role: UserRole,
      },
      token: req.headers.authorization.split(" ")[1],
    });
  })
);


router.post(
  "/login",
  cute(async (req, res, next) => {
    const { email, password } = req.body;
    const accounts = await Promise.all(
      [
        { model: Super, role: "SUPER" },
        { model: Admin, role: "ADMIN" },
        { model: User, role: "USER" },
      ].map(async ({ model, role }) => {
        return {
          // @ts-ignore
          user: await model.findOne({ email: email }),
          role,
        };
      })
    );

    let admin = accounts.filter((item) => (item.user ? true : false));
    if (admin?.length > 1)
      throw new Error("multi accounts with the same email bro help 👩‍🦯");
    const target = admin[0];
    if (admin) {
      const isValid = await checkPassword(password, target.user.password);
      if (isValid) {
        // @ts-ignore
        req.User = target.user;
        console.log(roles[target.role]);

        const token = generateToken(
          target.user,
          roles[target.role].secret(),
          target.role
        );
        target.user = target.user.toObject();
        delete target.user.password;
        res.json({
          data: target,
          token,
        });
      } else {
        res.status(401);
        throw new Error("password is not correct");
      }
    } else {
      res.status(401);
      throw new Error("Invalid email");
    }
  })
);

router.post('/logout', (req: Request, res: Response) => {
  req.json = null;

  res.send({});
});

export { router as AuthRoutes };
