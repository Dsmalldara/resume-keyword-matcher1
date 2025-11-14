import { Router } from "express";
import createAnalysisRoute from "./routes/createAnalysis.routes";
import getAllAnalysisRoute from "./routes/getAllAnalysis.route";
import getTrendRoute from "./routes/getTrend.route";
const router = Router();
router.use(createAnalysisRoute);
router.use(getAllAnalysisRoute);
router.use(getTrendRoute);
export default router;
