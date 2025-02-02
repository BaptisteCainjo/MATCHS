"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getProfile = getProfile;
exports.logoutUser = logoutUser;
const User_js_1 = __importDefault(require("../models/User.js"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_js_1 = require("../utils/constants.js");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const existingUser = yield User_js_1.default.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    message: "Email déjà pris",
                });
                return;
            }
            const newUser = new User_js_1.default({
                email,
                password,
            });
            yield newUser.save();
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
        }
        catch (error) {
            res.status(500).json({ message: "Error during signup" });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate("local", (err, user, info) => {
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
                const token = jsonwebtoken_1.default.sign(userPayload, constants_js_1.JwtSecretKey || "", {
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
    });
}
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Session:", req.session);
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: "Non authentifié" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, constants_js_1.JwtSecretKey || "");
            const user = {
                username: decoded.username || "Utilisateur",
                email: decoded.email || "inconnu",
            };
            res.status(200).json({ user });
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: "Non authentifié" });
        }
    });
}
function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la déconnexion" });
            }
            res.clearCookie("token");
            res.status(200).json({ message: "Déconnexion réussie" });
        });
    });
}
