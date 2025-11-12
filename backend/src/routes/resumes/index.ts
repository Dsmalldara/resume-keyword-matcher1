import { Router } from "express";
import completeUploadRoute from "./completeUpload.route";
import presignRoute from "./presign.route";
import finalizeUploadRoute from "./finalizeUpload.route";
import deleteResumeRoute from "./deleteResume.route"
import fetchResumeRoute from "./fetchResume.route";

const router = Router()


router.use(completeUploadRoute);
router.use(presignRoute);
router.use(finalizeUploadRoute);
router.use(deleteResumeRoute);
router.use(fetchResumeRoute);
export default router;