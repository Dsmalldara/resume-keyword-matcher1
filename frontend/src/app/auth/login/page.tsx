import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import LoginPage from "./components/LoginPage";

export const metadata: Metadata = generateMetadata({
  title: "Login",
  description:
    "Access your account to manage resumes, track performance, and optimize job applications",
});
function page() {
  return (
    <>
      <LoginPage />
    </>
  );
}

export default page;
