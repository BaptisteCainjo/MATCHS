import User from "../models/User.js";
import { Request, Response } from "express";
import passport from "passport";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtSecretKey } from "../utils/constants.js";

export async function registerUser(req: Request, res: Response) {
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
    res.status(500).json({ message: "Error during signup" });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ message: "Erreur d'authentification" });
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la connexion" });
      }

      const userPayload = { email: user.email };
      const token = jwt.sign(userPayload, JwtSecretKey || "", {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });

      res.status(200).json({
        message: "Connexion réussie",
        user,
      });
    });
  })(req, res);
}

export async function getProfile(req: Request, res: Response) {
  console.log("Session:", req.session);

  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JwtSecretKey || "") as JwtPayload;

    const user = {
      username: decoded.username || "Utilisateur",
      email: decoded.email || "inconnu",
    };

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Non authentifié" });
  }
}

export async function logoutUser(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussie" });
  });
}
