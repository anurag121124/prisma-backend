import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./src/routes/authRoutes";

// Configuration constants
const CONFIG = {
  API_VERSION: "v1",
  DEFAULT_PORT: 4000,
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
  }
} as const;

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));
    
    // Rate limiting
    this.app.use(rateLimit(CONFIG.RATE_LIMIT));
    
    // Request parsing and optimization
    this.app.use(bodyParser.json({ limit: "10kb" }));
    this.app.use(compression());
    
    // Remove sensitive headers
    this.app.disable("x-powered-by");
  }

  private initializeSwagger(): void {
    const swaggerOptions: swaggerJsdoc.Options = {
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
            bearerAuth: []  // This tells Swagger to use the bearerAuth security scheme globally
          }
        ]
      },
      apis: ["./src/routes/*.ts"]
    };
  
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }"
      })
    );
  }
  

  private initializeRoutes(): void {
    this.app.use(`/api/${CONFIG.API_VERSION}`, authRoutes);
    
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

export default new App().app;