import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { register } from "../controllers/authController";

const router = express.Router();

// router.post("/login", verifyToken, login);
router.post("/register", register); // Register route

router.get('/', () =>{
    console.log("Hello World");
})

export default router;
