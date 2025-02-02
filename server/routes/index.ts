import express from "express";
import authenticateRoutes from "./authRoutes.js";
//import spotifyRoutes from "./usersRoutes.js";

const router = express.Router();

router.use("/auth", authenticateRoutes);
//router.use("/api", spotifyRoutes);

export default router;
