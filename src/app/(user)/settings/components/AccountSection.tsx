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
import { Shield, KeyRound, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { SaveChangesButton } from "./PreferencesSection";

// Account Section Component
const AccountSection = () => {
  const [hasChanges] = useState(false);

  const handleChangePassword = () => {
    // Placeholder for password change logic
    console.log("Opening change password modal");
  };

  const handleDeleteAccount = () => {
    // Placeholder for delete account logic
    console.log("Opening delete account confirmation");
  };

  function handleSave(): void | Promise<void> {
    throw new Error("Function not implemented.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Account & Security
        </CardTitle>
        <CardDescription>Manage your account security and data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="text-base">Password</Label>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleChangePassword}
              className="gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 dark:border-red-800">
            <div className="space-y-1">
              <Label className="text-base text-red-600 dark:text-red-400">
                Delete Account
              </Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Account Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Member Since</Label>
              <p>January 2024</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Account Type</Label>
              <p>Premium</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Storage Used</Label>
              <p>2.4 GB / 10 GB</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Resumes Analyzed</Label>
              <p>47</p>
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
export default AccountSection;
