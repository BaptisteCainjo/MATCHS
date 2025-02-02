"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_js_1 = require("../controllers/authController.js");
const router = express_1.default.Router();
router.post("/signup", authController_js_1.registerUser);
router.post("/login", authController_js_1.loginUser);
router.get("/profile", authController_js_1.getProfile);
router.get("/logout", authController_js_1.logoutUser);
exports.default = router;
