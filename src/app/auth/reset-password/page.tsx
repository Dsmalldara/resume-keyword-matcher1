import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ResetPasswordPage from "./components/ResetPasswordPage";

export const metadata: Metadata = generateMetadata({
  title: "Reset Password",
  description:
    "Reset your account password to regain access and ensure security",
});

function page() {
  return (
    <>
      <ResetPasswordPage />
    </>
  );
}

export default page;
