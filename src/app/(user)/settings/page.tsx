import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

import SettingsPage from "./components/SettingsPage";

export const metadata: Metadata = generateMetadata({
  title: "Settings",
  description: "Manage your account settings and preferences",
});
function GeneralSettingsPage() {
  return <SettingsPage />;
}

export default GeneralSettingsPage;
