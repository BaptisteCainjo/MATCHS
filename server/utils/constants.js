"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtSecretKey = exports.sessionSecret = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sessionSecret = process.env.SESSION_SECRET;
exports.JwtSecretKey = process.env.JWT_SECRET_KEY;
