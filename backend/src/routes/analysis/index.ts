import { Router } from "express";
import createAnalysisRoute from "./routes/createAnalysis.routes";
import getAllAnalysisRoute from "./routes/getAllAnalysis.route";
const router = Router()
router.use(createAnalysisRoute );
router.use(getAllAnalysisRoute);
export default router;