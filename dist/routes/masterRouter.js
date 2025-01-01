"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const rideRoutes_1 = __importDefault(require("./rideRoutes"));
const router = (0, express_1.Router)();
router.use(authRoutes_1.default);
router.use(rideRoutes_1.default);
exports.default = router;
