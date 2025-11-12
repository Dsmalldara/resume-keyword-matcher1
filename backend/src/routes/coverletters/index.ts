import { Router } from "express";
import createLettersRoute from "./routes/createLetters.route";
import getCoverLettersRoute from "./routes/getCoverLetters.route";
import deleteLetterRoute from "./routes/deleteLetter.route";


const router = Router();

router.use(createLettersRoute);
router.use(getCoverLettersRoute);
router.use(deleteLetterRoute);

export default router;
