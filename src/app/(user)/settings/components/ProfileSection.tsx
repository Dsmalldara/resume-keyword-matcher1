"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Upload, Save } from "lucide-react";
import { SaveChangesButton } from "./PreferencesSection";

// Profile Section Component
const ProfileSection = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
  });
  const [hasChanges, setHasChanges] = useState(false);

  interface ProfileData {
    name: string;
    email: string;
    avatar: string | null;
  }

  const handleInputChange = (field: keyof ProfileData, value: string): void => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Placeholder for save logic
    console.log("Saving profile changes:", profileData);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={profileData.avatar || "/default-avatar.png"}
              alt="Profile Picture"
            />
            <AvatarFallback className="text-lg">
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Photo
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG up to 2MB. Recommended: 400x400px
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
            />
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 text-xs"
            >
              Verified
            </Badge>
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

export default ProfileSection;
