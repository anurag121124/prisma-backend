import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Swagger documentation setup
const swaggerOptions: swaggerJsdoc.Options = {
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

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth routes
app.use("/api/auth", authRoutes);

export default app;
