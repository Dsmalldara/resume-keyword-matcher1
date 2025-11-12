import { Router } from "express";
import AnalysisInsightRoute from "./routes/Improvement.Route";
import BestMatchRoute from "./routes/BestMatch.route";
import JobsAnalyzed from "./routes/JobsAnalyzed.route";

const router = Router();
router.use(AnalysisInsightRoute);
router.use(BestMatchRoute);
router.use(JobsAnalyzed);

export default router;