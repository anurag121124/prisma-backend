"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const jwtUtils_1 = require("./utils/jwtUtils");
const masterRouter_1 = __importDefault(require("./routes/masterRouter"));
// Configuration constants
const CONFIG = {
    API_VERSION: "v1",
    DEFAULT_PORT: process.env.PORT || 4000,
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
    },
};
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        var _a;
        this.app.use((0, helmet_1.default)());
        // Request Logger
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
            next();
        });
        // Parse the CORS_ORIGIN environment variable
        const allowedOrigins = ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",")) || ["*"];
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }));
        // Rate Limiting
        this.app.use((0, express_rate_limit_1.default)(CONFIG.RATE_LIMIT));
        // Body Parser and Compression
        this.app.use(express_1.default.json({ limit: "10kb" }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, compression_1.default)());
        this.app.disable("x-powered-by");
    }
    initializeSwagger() {
        const swaggerOptions = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "API Documentation",
                    version: "1.0.0",
                    description: "API documentation with security and authentication",
                },
                servers: [
                    {
                        url: process.env.API_URL || `http://localhost:${CONFIG.DEFAULT_PORT}/api/${CONFIG.API_VERSION}`,
                        description: "Development API Server",
                    },
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT",
                        },
                    },
                },
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
            },
            apis: ["./src/routes/*.ts"],
        };
        const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
        const authenticateSwagger = (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ error: "Unauthorized access to API documentation" });
                return;
            }
            const token = authHeader.split(" ")[1];
            try {
                (0, jwtUtils_1.verifyToken)(token);
                next();
            }
            catch (_a) {
                res.status(401).json({ error: "Invalid or expired token" });
            }
        };
        this.app.use("/api-docs", (req, res, next) => authenticateSwagger(req, res, next), // Explicitly match middleware signature
        swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
        }));
    }
    initializeRoutes() {
        this.app.use(`/api/${CONFIG.API_VERSION}`, masterRouter_1.default);
        this.app.get("/health", (_req, res) => {
            res.status(200).json({ status: "healthy" });
        });
        this.app.use("*", (_req, res) => {
            res.status(404).json({ error: "Route not found" });
        });
    }
    initializeErrorHandling() {
        this.app.use((err, _req, res, _next) => {
            console.error(`[${new Date().toISOString()}] Error:`, err.message);
            res.status(500).json({ error: "Internal Server Error" });
        });
    }
}
exports.default = new App().app;
