import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { getUsers, getUserById, register } from "../controllers/authController";

const router = express.Router();

// router.post("/login", verifyToken, login);
router.post("/register", register); // Register route
router.get("/user",getUsers)
router.get("/user/:userId", getUserById);

router.get('/', () =>{
    console.log("Hello World");
})

export default router;
