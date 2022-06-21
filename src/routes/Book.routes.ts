import { cute } from "@utils";
import { Router } from "express";
import { Book, Genre } from "@models";
import { upload } from "middlewares/upload";
import { handlFile } from "config/media";
import { isAdmin, isAuthenticated, isSuper } from "middlewares/profiles";
import { or } from "middlewares/operators";

const router = Router();

// get all books
router.get(
  "/all",
  or(isAdmin, isSuper, isAuthenticated),
  cute(async (req, res) => {
    const books = await Book.find().populate("author genre");
    res.json(books);
  })
);
// add new book
router.post(
  "/add",
  or(isAdmin, isSuper),
  handlFile.fields([{ name: "bookCover" }]),
  cute(async (req, res) => {
    const { genre } = req.body;
    //@ts-ignore
    // const { bookCover } = req.files;
    // bookCover && (req.body.bookCover = await upload(bookCover[0]));
    const book = await Book.create(req.body);
    await Genre.updateMany(
      { _id: { $in: genre } },
      { $addToSet: { books: book._id } }
    );

    res.json(book);
  })
);

// update book
router.put(
  "/update/:id",
  or(isAdmin,isSuper),
  handlFile.fields([{ name: "bookCover" }]),
  cute(async (req, res) => {
    const { id } = req.params;
    const { genre } = req.body;
    //@ts-ignore
    const { bookCover } = req.files;
    bookCover && (req.body.bookCover = await upload(bookCover[0]));
    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await Genre.updateMany(
      { _id: { $in: genre } },
      { $addToSet: { books: book?._id } }
    );

    res.json(book);
  })
);

// delete book
router.delete(
  "/delete/:id",
  or(isAdmin,isSuper),
  cute(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    await Genre.updateMany(
      { books: { $in: [book?._id] } },
      { $pull: { books: book?._id } }
    );
    res.json(book);
  })
);

// get book by id
router.get(
  "/:id",
  or(isAdmin,isSuper,isAuthenticated),
  cute(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id).populate("author genre");
    res.json(book);
  })
);

//search book by name
router.get(
  "/search/:name",
  or(isAdmin,isSuper,isAuthenticated),
  cute(async (req, res) => {
    const { name } = req.params;
    const book = await Book.find({
      bookName: { $regex: name, $options: "i" },
    }).populate("author genre");
    res.json(book);
  })
);

export { router as BookRoutes };
