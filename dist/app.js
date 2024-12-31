"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
// Configuration constants
const CONFIG = {
    API_VERSION: "v1",
    DEFAULT_PORT: 4000,
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // Limit each IP to 100 requests per windowMs
    }
};
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeRoutes();
    }
    initializeMiddlewares() {
        // Security middlewares
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));
        // Rate limiting
        this.app.use((0, express_rate_limit_1.default)(CONFIG.RATE_LIMIT));
        // Request parsing and optimization
        this.app.use(body_parser_1.default.json({ limit: "10kb" }));
        this.app.use((0, compression_1.default)());
        // Remove sensitive headers
        this.app.disable("x-powered-by");
    }
    initializeSwagger() {
        const swaggerOptions = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "API Documentation",
                    version: "1.0.0",
                    description: "API documentation with security and authentication"
                },
                servers: [
                    {
                        url: process.env.API_URL || `http://localhost:${CONFIG.DEFAULT_PORT}/api/${CONFIG.API_VERSION}`,
                        description: "API Server"
                    }
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT"
                        }
                    }
                },
                security: [
                    {
                        bearerAuth: [] // This tells Swagger to use the bearerAuth security scheme globally
                    }
                ]
            },
            apis: ["./src/routes/*.ts"]
        };
        const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }"
        }));
    }
    initializeRoutes() {
        this.app.use(`/api/${CONFIG.API_VERSION}`, authRoutes_1.default);
        // Health check endpoint
        this.app.get("/health", (_, res) => {
            res.status(200).json({ status: "healthy" });
        });
        // Handle undefined routes
        this.app.use("*", (_, res) => {
            res.status(404).json({ error: "Not Found" });
        });
    }
}
exports.default = new App().app;
