import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);

export default app;
