import { PrismaClient, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

interface LogActivityParams {
  profileId: string;
  type: ActivityType;
  entityId: string;      // resumeId, jobId, etc.
  entityType: string;    // "resume", "job", "profile"
  message: string;       // "Senior_Developer_Resume.pdf uploaded"
  metadata?: Record<string, any>;
}

export async function logActivity({
  profileId,
  type,
  entityId,
  entityType,
  message,
  metadata,
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        profileId,
        type,
        entityId,
        entityType,
        message,
        metadata: metadata || undefined,
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}