import { cute } from "@utils";
import { Router } from "express";
import { upload } from "middlewares/upload";
import { handlFile } from "config/media";
import { Author } from "models/Author";
import { isAdmin, isAuthenticated, isSuper } from "middlewares/profiles";
import { or } from "@middlewares";

const router = Router();

// get all Authors
router.get(
  "/all",
  or(isAdmin, isSuper, isAuthenticated),
  cute(async (req, res) => {
    const authors = await Author.find().populate("books genres");
    res.json(authors);
  })
);

// add new Author
router.post(
  "/add",
  or(isAdmin, isSuper),
  handlFile.fields([{ name: "authorImage" }]),
  cute(async (req, res) => {
    //@ts-ignore
    const { authorImage } = req.files;
    authorImage && (req.body.authorImage = await upload(authorImage[0]));
    const author = await Author.create(req.body);
    res.json(author);
  })
);

// update Author
router.put(
  "/update/:id",
  or(isAdmin, isSuper),
  handlFile.fields([{ name: "authorImage" }]),
  cute(async (req, res) => {
    const { id } = req.params;
    //@ts-ignore
    const { authorImage } = req.files;
    authorImage && (req.body.authorImage = await upload(authorImage[0]));
    const author = await Author.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(author);
  })
);

// delete Author
router.delete(
  "/delete/:id",
  or(isAdmin, isSuper),
  cute(async (req, res) => {
    const { id } = req.params;
    const author = await Author.findByIdAndDelete(id);
    res.json(author);
  })
);

// get Author by id
router.get(
  "/:id",
  or(isAdmin, isSuper, isAuthenticated),
  cute(async (req, res) => {
    const { id } = req.params;
    const author = await Author.findById(id).populate("books genres");
    res.json(author);
  })
);

// search Author by name
router.get(
  "/search/:name",
  or(isAdmin, isSuper),
  cute(async (req, res) => {
    const { name } = req.params;
    const author = await Author.find({
      name: { $regex: name, $options: "i" },
    }).populate("books genres");
    res.json(author);
  })
);

export { router as AuthorRoutes };
