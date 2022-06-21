import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IGenre {
  id: string;
  name: string;
  books: string[];
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<IGenre>(
  {
    name: {
      type: String,
      required: true,
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

// 3. Create a Model.
export const Genre = model<IGenre>("Genre", schema);
