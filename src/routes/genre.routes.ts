import { checkPassword } from "@lib";
import { cute } from "@utils";
import { Router } from "express";
import { Genre } from "@models";
import { isAdmin, isAuthenticated, isSuper } from "middlewares/profiles";
import { or } from "@middlewares";

const router = Router();

//get all genres
router.get(
  "/all",
  or(isAdmin, isSuper, isAuthenticated),
  cute(async (req, res) => {
    const genres = await Genre.find().populate({
      path: "books",
    });
    res.json(genres);
  })
);

// add new genre
router.post(
  "/add",
  or(isAdmin, isSuper),
  cute(async (req, res) => {
    const genre = await Genre.create(req.body);
    res.json({
      message: "Genre added successfully",
      genre,
    });
  })
);

// update genre
router.put(
  "/update/:id",
  or(isAdmin, isSuper),
  cute(async (req, res) => {
    const { id } = req.params;
    const genre = await Genre.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "Genre updated successfully",
      genre,
    });
  })
);

// delete genre
router.delete(
  "/delete/:id",
  or(isAdmin, isSuper),
  cute(async (req, res) => {
    const { id } = req.params;
    const genre = await Genre.findByIdAndDelete(id);
    res.json({
      message: "Genre deleted successfully",
      genre,
    });
  })
);

// get genre by id
router.get(
  "/:id",
  or(isAdmin, isSuper, isAuthenticated),
  cute(async (req, res) => {
    const { id } = req.params;
    const genre = await Genre.findById(id).populate({
      path: "books",
    });
    res.json(genre);
  })
);

// get books by genre id
router.get(
  "/books/:id",
  or(isAdmin, isSuper, isAuthenticated),
  cute(async (req, res) => {
    const { id } = req.params;
    const genre = await Genre.findById(id).populate({
      path: "books",
    });
    res.json(genre?.books);
  })
);

// get books by genre name
router.get(
  "/books/name/:name",
  or(isAdmin, isSuper, isAuthenticated),
  cute(async (req, res) => {
    const { name } = req.params;
    const genre = await Genre.findOne({ name }).populate({
      path: "books",
    });
    res.json(genre?.books);
  })
);

export { router as genreRoutes };
