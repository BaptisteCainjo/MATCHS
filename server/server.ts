import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
    secret: "votre-secret",
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
  done(null, user._id);
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
app.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({
          message: "Email déjà pris",
        });
        return;
      }

      const newUser = new User({
        email,
        password,
      });
      await newUser.save();

      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({
            message: "Erreur lors de l'inscription",
          });
          return;
        }

        res.status(201).json({
          message: "Inscription réussie",
          user: newUser,
        });
      });
    } catch (error) {
      next(error);
    }
  }
);

// ... existing code ...

app.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response): void => {
    // Créer un objet simple avec uniquement les propriétés nécessaires
    const userPayload = {
      id: (req.user as any)._id,
      email: (req.user as any).email,
    };

    const token = jwt.sign(userPayload, "your-secret-key", {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: req.user,
    });
  }
);

// ... existing code ...

app.get("/logout", (req: Request, res: Response): void => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Erreur lors de la déconnexion" });
      return;
    }
    res.status(200).json({ message: "Déconnexion réussie" });
  });
});

app.get(
  "/profile",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Session:", req.session);

    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        message: "Non authentifié",
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, "your-secret-key") as JwtPayload;
      const user = {
        username: decoded.username || "Utilisateur",
        email: decoded.email || "inconnu",
      };

      res.status(200).json({
        user,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
