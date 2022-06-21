import { Schema, model } from "mongoose";
import { IBook } from "./Book";
import { IGenre } from "./Genre";

// 1. Create an interface representing a document in MongoDB.
export interface IAuthor {
  id: string;
  name: string;
  authorImage: string;
  books: IBook[];
  genres: IGenre[];
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
  },
  { timestamps: true }
);

// 3. Create a Model.
export const Author = model<IAuthor>("Author", schema);
