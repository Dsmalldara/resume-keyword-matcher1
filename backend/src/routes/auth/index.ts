import SignupRoute from "./routes/signUp.route";
import LoginRoute from "./routes/login.route";
import LogoutRoute from "./routes/logout.route";
import RefreshRoute from "./routes/refresh.route";
import ForgotPasswordRoute from "./routes/forgotPassword.route";
import ResetPasswordRoute from "./routes/resetPassword.route";
import OAuthGoogleCallbackRoute from "./routes/OAuthGoogleCallback.route";
import OAuthGoogleRoute from "./routes/oAuthGoogle.route";
import ProfileSyncRoute from "./routes/profileSync.route";

import { Router } from "express";

const router = Router();
router.use(SignupRoute);
router.use(LoginRoute);
router.use(LogoutRoute);
router.use(RefreshRoute);
router.use(ForgotPasswordRoute);
router.use(ResetPasswordRoute);
router.use(OAuthGoogleRoute);
router.use(OAuthGoogleCallbackRoute);
router.use(ProfileSyncRoute);
export default router;
