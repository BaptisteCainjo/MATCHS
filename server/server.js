// server.js

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_DB = process.env.MONGO_DB;

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://cainjobaptiste:${MONGO_DB}@flow.xjtqr.mongodb.net/?retryWrites=true&w=majority&appName=Flow`
);

// User model
const User = require("./models/User");

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
    }, // Utilisez l'email comme champ d'identification
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email,
        });

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

passport.serializeUser((user, done) => {
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
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email déjà pris",
      });
    }

    const newUser = new User({
      email,
      password,
    });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de l'inscription",
        });
      }

      return res.status(201).json({
        message: "Inscription réussie",
        user: newUser,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'inscription",
    });
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  const user = {
    email: req.user.email,
  };

  const token = jwt.sign(user, "your-secret-key", {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    maxAge: 3600000, // 1 hour
  });

  res.status(200).json({
    message: "Connexion réussie",
    user: req.user,
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({
    message: "Déconnexion réussie",
  });
});

app.get("/profile", (req, res) => {
  console.log("Session:", req.session);

  // Vérifiez si le token existe dans les cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Non authentifié",
    });
  }

  try {
    // Vérifiez le token
    const decoded = jwt.verify(token, "your-secret-key");

    // Utilisez decoded.username, decoded.email, etc. selon votre structure de token
    const user = {
      username: decoded.username,
      email: decoded.email,
    };

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Non authentifié",
    });
  }
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
