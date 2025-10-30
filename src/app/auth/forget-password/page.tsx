import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ForgotPassword from "./components/ForgetPasswordPage";

export const metadata: Metadata = generateMetadata({
  title: "Forgot Password",
  description: "Reset your password to regain access to your account",
});
function page() {
  return (
    <>
      <ForgotPassword />
    </>
  );
}

export default page;
