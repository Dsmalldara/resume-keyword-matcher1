import prisma from "../../lib/prisma";
import path from 'path';
export const sanitizeFilename = (filename: string, uploadId: string): string => {
    const ext = path.extname(filename).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    
    if (!allowedExtensions.includes(ext)) {
        throw new Error(`File type ${ext} not allowed`);
    }
    
    return `${uploadId}${ext}`;
};



export async function getStorageKey(userId: string) {
  try {
    console.log("Fetching storage key for userId:", userId);
    
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { storageKey: true },
    });
    
    console.log("Profile retrieved:", profile);
    
    if (!profile) {
      console.error("No profile found for userId:", userId);
      return null;
    }
    
    if (!profile.storageKey) {
      console.error("Profile exists but storageKey is null/undefined for userId:", userId);
      return null;
    }
    
    console.log("Storage key found:", profile.storageKey);
    return profile.storageKey;
    
  } catch (err) {
    console.error("Error fetching storage key:", err);
    throw err;
  }
}