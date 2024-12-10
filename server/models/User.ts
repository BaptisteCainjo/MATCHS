import mongoose, { Document, Model, Schema, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  password: string;
  email: string;
  validPassword(password: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

userSchema.pre<IUser>(
  "save",
  async function (next: (err?: CallbackError) => void): Promise<void> {
    try {
      if (!this.isModified("password")) return next();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  }
);

// Validate password
userSchema.methods.validPassword = async function (
  password: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
