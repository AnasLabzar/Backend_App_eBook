import { model, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

export interface ISuper {
  id: string;
  name: string;
  email: string;
  password?: string;
}

const SuperSchema = new Schema<ISuper>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

SuperSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    user.password &&
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
  });
});

SuperSchema.methods.comparePassword = function (
  candidatePassword: string,
  cb: Function
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

SuperSchema.plugin(uniqueValidator);
export const Super = model<ISuper>("Super", SuperSchema);
