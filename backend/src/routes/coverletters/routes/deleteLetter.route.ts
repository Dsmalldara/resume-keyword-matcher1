/**
 * @swagger
 * /coverletters/delete/{id}:
 *   delete:
 *     summary: Delete a cover letter
 *     description: Deletes a cover letter owned by the authenticated user
 *     tags:
 *       - Cover Letters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cover letter to delete
 *         example: clx1234567890abcdef
 *     responses:
 *       200:
 *         description: Cover letter deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cover letter deleted successfully
 *       400:
 *         description: Validation error - missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this cover letter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized to delete this cover letter
 *       404:
 *         description: Cover letter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cover letter not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete cover letter
 */

import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthMiddleware } from '../../../middleware/auth';
import prisma from '../../../lib/prisma';
import logger from '../../../../utils/logger';
import { logActivity } from '../../../../utils/activityLogger';
import { getIndividualLetterValidation } from '../validations/coverLetterValidation';

const router = Router();

// DELETE /coverletters/delete/:id - delete a cover letter (ownership enforced)
router.delete('/delete/:id', AuthMiddleware, getIndividualLetterValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user?.id!;
  const { id } = req.params;

  try {
    const coverLetter = await prisma.coverLetter.findUnique({
      where: { id },
      select: {
        id: true,
        profileId: true,
        resumeId: true,
        preview: true,
        profile: { select: { userId: true } },
      },
    });

    if (!coverLetter) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }

    if (coverLetter.profile.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this cover letter' });
    }

    await prisma.coverLetter.delete({ where: { id } });

    // Log deletion activity. 
    await logActivity({
      profileId: coverLetter.profileId,
      type: 'COVER_LETTER_UPDATE',
      entityId: id,
      entityType: 'cover_letter',
      message: `Cover letter ${id} deleted`,
      metadata: {
        resumeId: coverLetter.resumeId,
        preview: coverLetter.preview,
      },
    });

    logger.info(`Cover letter ${id} deleted for profile ${coverLetter.profileId}`);

    return res.status(200).json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    logger.error('Error deleting cover letter', { error });
    return res.status(500).json({ error: 'Failed to delete cover letter' });
  }
});

export default router;
