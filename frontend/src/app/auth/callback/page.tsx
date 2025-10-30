import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AuthSignUpCallback from "./AuthSignUpCallback";

export const metadata: Metadata = generateMetadata({
  title: "Sign Up Callback",
  description:
    "Handle the callback after user sign up to verify authentication and redirect accordingly",
});

function page() {
  return (
    <>
      <AuthSignUpCallback />
    </>
  );
}

export default page;
