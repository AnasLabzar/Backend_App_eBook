import { Schema, model } from "mongoose";
import { IAuthor } from "./Author";
import { IGenre } from "./Genre";

// 1. Create an interface representing a document in MongoDB.
export interface IBook {
  id: string;
  bookName: string;
  bookCover: string;
  rating: number;
  language: string;
  pageNo: number;
  author: IAuthor;
  genre: IGenre[];
  readed: number;
  description: string;
  backgroundColor: string;
  navTintColor: string;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<IBook>(
  {
    bookName: {
      type: String,
    },
    bookCover: {
      type: String,
    },
    rating: {
      type: Number,
    },
    language: {
      type: String,
    },
    pageNo: {
      type: Number,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
    genre: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    readed: {
      type: Number,
    },
    description: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
    navTintColor: {
      type: String,
    },
  },
  { timestamps: true }
);

// 3. Create a Model.
export const Book = model<IBook>("Book", schema);
