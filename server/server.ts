import express, { Request, Response } from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import router from "./routes/index.js";
import { sessionSecret } from "./utils/constants.js";

import User from "./models/User";

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_DB = process.env.MONGO_DB;

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://cainjobaptiste:${MONGO_DB}@flow.xjtqr.mongodb.net/?retryWrites=true&w=majority&appName=Flow`
);

// Express middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: sessionSecret || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: false,
      sameSite: "strict",
      maxAge: 3600000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

// Passport configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user || !user.validPassword(password)) {
          return done(null, false, {
            message: "Email ou mot de passe incorrect",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes

app.get("/logout", (req: Request, res: Response): void => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
    res.status(200).json({ message: "Déconnexion réussie" });
  });
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
