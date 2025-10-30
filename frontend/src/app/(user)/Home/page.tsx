import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { redirect } from "next/navigation";

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description:
    "Track your resume optimization progress and job matching insights",
});
function page() {
  redirect("/");
}

export default page;
