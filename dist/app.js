"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
// Middleware setup
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Swagger documentation setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'This is a sample API documentation using Swagger in Express with TypeScript',
        },
    },
    apis: ['./src/routes/*.ts'], // Ensure this path matches the actual location of your routes
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Swagger docs route
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Auth routes
app.use("/", authRoutes_1.default);
exports.default = app;
