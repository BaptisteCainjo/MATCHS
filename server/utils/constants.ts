import dotenv from "dotenv";
dotenv.config();

export const sessionSecret = process.env.SESSION_SECRET;
export const JwtSecretKey = process.env.JWT_SECRET_KEY;
