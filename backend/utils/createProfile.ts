

import crypto from 'crypto';
import prisma from '../src/lib/prisma'
export async function createUserProfile(user: any) {
  try {
    console.log('Creating profile for user:', user); // Add debug log
    
    // 1. Find profile by email (The true unique identifier)
    const existingProfile = await prisma.profile.findUnique({
      where: { email: user.email },
    });

    if (existingProfile) {
      console.log(`✅ Profile already exists for ${user.email}`);

      // Check if the Supabase userId has changed
      if (existingProfile.userId !== user.id) {  // Changed from user.userId
        console.log(`🔄 Updating userId from ${existingProfile.userId} to ${user.id}`);
        
        const updatedProfile = await prisma.profile.update({
          where: { id: existingProfile.id },
          data: { 
            userId: user.id,  // Changed from user.userId
            displayName: user.user_metadata?.name || user.user_metadata?.full_name || existingProfile.displayName,
            avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || existingProfile.avatarUrl,
          },
        });
        return updatedProfile;
      }
      
      return existingProfile;
    }

    // 3. Create new profile if none exists
    const profile = await prisma.profile.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,  // Changed from user.userId
        email: user.email, 
        username: user.user_metadata?.username || user.email?.split('@')[0] || null,
        displayName: user.user_metadata?.name || user.user_metadata?.full_name || null,
        bio: user.user_metadata?.bio || null,
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      },
    });

    // 4. Create default usage quota
    await (prisma as any).usageQuota.create({
        data: {
            profileId: profile.id,
            tier: 'FREE',
            resumesLimit: 3,
            analysesLimit: 5,
            coverLettersLimit: 5,
            analysesResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            coverLettersResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });

    console.log(`✅ Created profile and quota for user ${user.email}`);
    return profile;
  } catch (err) {
    console.error('❌ Error creating profile:', err);
    throw err;
  }
}