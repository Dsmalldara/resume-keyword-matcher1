"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Cog, Bell, Save, Check } from "lucide-react";
import { useState } from "react";

export const SaveChangesButton = ({
  hasChanges,
  onSave,
  isLoading = false,
  className = "",
  size = "default",
}: {
  hasChanges: boolean;
  onSave: () => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: string;
}) => {
  const handleSave = async () => {
    if (isLoading || !hasChanges) return;

    await onSave();
  };
  return <Button size={size}>Save</Button>;
};

const PreferencesSection = () => {
  const [preferences, setPreferences] = useState({
    defaultResume: "resume-1",
    emailNotifications: true,
    pushNotifications: false,
    analysisUpdates: true,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const resumes = [
    { id: "resume-1", name: "Software Engineer Resume" },
    { id: "resume-2", name: "Product Manager Resume" },
    { id: "resume-3", name: "Data Analyst Resume" },
  ];

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Placeholder for save logic
    console.log("Saving preferences:", preferences);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="w-5 h-5" />
          Preferences
        </CardTitle>
        <CardDescription>
          Customize your dashboard experience and notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Resume Selection */}
        <div className="space-y-2">
          <Label
            htmlFor="default-resume"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Default Resume
          </Label>
          <Select
            value={preferences.defaultResume}
            onValueChange={(value) =>
              handlePreferenceChange("defaultResume", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your default resume" />
            </SelectTrigger>
            <SelectContent>
              {resumes.map((resume) => (
                <SelectItem key={resume.id} value={resume.id}>
                  {resume.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This resume will be selected by default for new analyses
          </p>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </h4>

          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your resume analyses
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  handlePreferenceChange("emailNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications in your browser
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) =>
                  handlePreferenceChange("pushNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analysis-updates">Analysis Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when analysis recommendations change
                </p>
              </div>
              <Switch
                id="analysis-updates"
                checked={preferences.analysisUpdates}
                onCheckedChange={(checked) =>
                  handlePreferenceChange("analysisUpdates", checked)
                }
              />
            </div>
          </div>
        </div>

        <SaveChangesButton
          hasChanges={hasChanges}
          onSave={handleSave}
          className="mt-6"
        />
      </CardContent>
    </Card>
  );
};

export default PreferencesSection;
