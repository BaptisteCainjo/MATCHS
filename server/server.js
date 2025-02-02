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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_js_1 = __importDefault(require("./routes/index.js"));
const constants_js_1 = require("./utils/constants.js");
const User_1 = __importDefault(require("./models/User"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8001;
const MONGO_DB = process.env.MONGO_DB;
// Connect to MongoDB
mongoose_1.default.connect(`mongodb+srv://cainjobaptiste:${MONGO_DB}@flow.xjtqr.mongodb.net/?retryWrites=true&w=majority&appName=Flow`);
// Express middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: constants_js_1.sessionSecret || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: false,
        sameSite: "strict",
        maxAge: 3600000,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api", index_js_1.default);
// Passport configuration
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user || !user.validPassword(password)) {
            return done(null, false, {
                message: "Email ou mot de passe incorrect",
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
// Routes
app.get("/logout", (req, res) => {
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
