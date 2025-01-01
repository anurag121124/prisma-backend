import { Router } from "express";
import authRouter from "./authRoutes";
import rideRouter from "./rideRoutes";

const router = Router();

router.use(authRouter);
router.use(rideRouter);

export default router;
