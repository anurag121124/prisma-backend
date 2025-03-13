import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { verifyToken } from "./utils/jwtUtils";
import router from "./routes/masterRouter";

// Configuration constants
const CONFIG = {
  API_VERSION: "v1",
  DEFAULT_PORT: process.env.PORT || 4000,
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
} as const;

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());

    // Request Logger
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });

    // Parse the CORS_ORIGIN environment variable
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["*"];
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    // Rate Limiting
    this.app.use(rateLimit(CONFIG.RATE_LIMIT));

    // Body Parser and Compression
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.disable("x-powered-by");
  }

  private initializeSwagger(): void {
    const swaggerOptions: swaggerJsdoc.Options = {
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

    const swaggerSpec = swaggerJsdoc(swaggerOptions);


    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
      })
    );
  }

  private initializeRoutes(): void {
    this.app.use(`/api/${CONFIG.API_VERSION}`,router);

    this.app.get("/health", (_req, res) => {
      res.status(200).json({ status: "healthy" });
    });

    this.app.use("*", (_req, res) => {
      res.status(404).json({ error: "Route not found" });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(`[${new Date().toISOString()}] Error:`, err.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    );
  }
}

export default new App().app;
