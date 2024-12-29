"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("./constants");
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, constants_1.AUTH_CONSTANTS.SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
const comparePasswords = async (password, hashedPassword) => {
    return bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePasswords = comparePasswords;
