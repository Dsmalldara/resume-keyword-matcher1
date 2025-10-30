import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import SignupPage from "./components/SignupPage";

export const metadata: Metadata = generateMetadata({
  title: "Sign Up",
  description:
    "Create an account to manage resumes, track performance, and optimize job applications",
});

function page() {
  return (
    <>
      <SignupPage />
    </>
  );
}

export default page;
