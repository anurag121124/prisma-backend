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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passwordUtils_1 = require("../utils/passwordUtils");
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Find the user by email
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        // Step 2: If no user is found, throw an error
        if (!user) {
            throw new Error("User not found");
        }
        // Step 3: Compare the provided password with the stored hashed password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        // Step 4: If the password is invalid, throw an error
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        // Step 5: Return the user excluding sensitive information like password
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        throw new Error(`Error in loginUser: ${error.message}`);
    }
});
exports.loginUser = loginUser;
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { firebaseId, email, fullName, socketId, password, mobile_number } = user;
    try {
        // Check if the user already exists by firebaseId or email
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        // Hash the password (if necessary, though Firebase handles this)
        const hashedPassword = yield (0, passwordUtils_1.hashPassword)(password);
        console.log(passwordUtils_1.hashPassword, "hashPassword");
        // Step 2: Create a new user in the database
        const newUser = yield prisma_1.default.user.create({
            data: {
                firebaseId,
                email,
                fullName,
                socketId,
                password: hashedPassword,
                mobile_number,
            },
        });
        return newUser;
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        throw new Error(`Error in registerUser: ${error.message}`);
    }
});
exports.registerUser = registerUser;
