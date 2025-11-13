import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { requestIdMiddleware } from "./middleware/requestId";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import debugRoutes from "./routes/debug.routes";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger.config";
import cookieParser from "cookie-parser";
import activityRoutes from "./routes/activity/activity.routes";
import resumeRoutes from "./routes/resumes/index";
import analysisRoutes from "./routes/analysis/index";
import InsightsRoutes from "./routes/insights/index";
import authRoutes from "./routes/auth/index";
import CoverLetterRoutes from "./routes/coverletters/index";

dotenv.config();

const app = express();
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const allowedOrigins = [
      process.env.Frontend_Url,
      process.env.PRODUCTION_URL,
      "http://localhost:3000",
      "http://localhost:3001",
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

// Request ID for tracking
app.use(requestIdMiddleware);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logData = {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
    };

    if (statusCode >= 500) {
      logger.error("Request completed", logData);
    } else if (statusCode >= 400) {
      logger.warn("Request completed", logData);
    } else {
      logger.info("Request completed", logData);
    }
  });

  next();
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Resume API Docs",
  }),
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
app.use("/auth", authRoutes);
app.use("/resume", resumeRoutes);
app.use("/activity", activityRoutes);
app.use("/debug", debugRoutes);
app.use("/analysis", analysisRoutes);
app.use("/insights", InsightsRoutes);
app.use("/coverletters", CoverLetterRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn("Route not found", {
    requestId: req.id,
    method: req.method,
    path: req.path,
  });
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error", {
    requestId: req.id,
    error: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
